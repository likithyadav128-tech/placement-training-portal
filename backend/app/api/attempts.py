from typing import Optional, List, Dict, Any
from datetime import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User, UserRole
from app.models.academic import Student
from app.models.assessments import (
    Assessment,
    AssessmentType,
    Question,
    AssessmentQuestion,
    TestAttempt,
    PerformanceRecord
)
from app.auth.dependencies import get_current_user
from app.services.code_runner_service import CodeRunnerService
from app.middleware.audit import log_audit_event

router = APIRouter(prefix="/attempts", tags=["Attempts"])


class StartAttemptRequest(BaseModel):
    assessment_id: int


class SubmitAttemptRequest(BaseModel):
    # Map of question_id to answer string (or code for coding questions)
    answers: Dict[str, str]
    code_languages: Optional[Dict[str, str]] = None  # question_id -> language for coding questions


@router.post("/start")
async def start_attempt(
    payload: StartAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Initializes a new assessment attempt for the student."""
    if not current_user.student_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can start assessment attempts."
        )

    stmt = select(Assessment).where(Assessment.id == payload.assessment_id)
    result = await db.execute(stmt)
    assessment = result.scalars().first()

    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found.")

    attempt = TestAttempt(
        student_id=current_user.student_profile.id,
        assessment_id=assessment.id,
        status="IN_PROGRESS",
        started_at=datetime.utcnow()
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    return {"attempt_id": attempt.id, "started_at": attempt.started_at}


@router.post("/{attempt_id}/submit")
async def submit_attempt(
    attempt_id: int,
    payload: SubmitAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits answers, computes score, test case results, and records performance history."""
    stmt = (
        select(TestAttempt)
        .options(
            selectinload(TestAttempt.assessment).selectinload(Assessment.questions).selectinload(AssessmentQuestion.question)
        )
        .where(TestAttempt.id == attempt_id)
    )
    result = await db.execute(stmt)
    attempt = result.scalars().first()

    if not attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found.")

    if current_user.role == UserRole.STUDENT:
        if not current_user.student_profile or attempt.student_id != current_user.student_profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot submit another student's test.")

    assessment = attempt.assessment
    questions = [aq.question for aq in assessment.questions]
    
    total_questions = len(questions)
    correct_count = 0
    incorrect_count = 0
    skipped_count = 0
    question_breakdown = []

    for q in questions:
        user_ans = payload.answers.get(str(q.id), "").strip()
        
        if not user_ans:
            skipped_count += 1
            question_breakdown.append({
                "question_id": q.id,
                "question": q.question,
                "type": q.type,
                "user_answer": None,
                "correct_answer": q.answer,
                "is_correct": False,
                "is_skipped": True,
                "explanation": q.explanation
            })
            continue

        if q.type == "CODING":
            lang = (payload.code_languages or {}).get(str(q.id), "python")
            run_res = CodeRunnerService.execute_code(user_ans, lang, q.test_cases or "[]")
            is_correct = run_res["all_passed"]
            if is_correct:
                correct_count += 1
            else:
                incorrect_count += 1
            
            question_breakdown.append({
                "question_id": q.id,
                "question": q.question,
                "type": q.type,
                "user_answer": user_ans,
                "correct_answer": "[Refer to problem specification]",
                "is_correct": is_correct,
                "is_skipped": False,
                "test_case_results": run_res["test_cases"],
                "explanation": q.explanation
            })
        else:
            # MCQ / Aptitude evaluation
            is_correct = user_ans.lower() == q.answer.strip().lower()
            if is_correct:
                correct_count += 1
            else:
                incorrect_count += 1

            question_breakdown.append({
                "question_id": q.id,
                "question": q.question,
                "type": q.type,
                "user_answer": user_ans,
                "correct_answer": q.answer,
                "is_correct": is_correct,
                "is_skipped": False,
                "explanation": q.explanation
            })

    score_pct = round((correct_count / total_questions) * 100, 1) if total_questions > 0 else 0.0

    attempt.score = score_pct
    attempt.correct_count = correct_count
    attempt.incorrect_count = incorrect_count
    attempt.skipped_count = skipped_count
    attempt.status = "COMPLETED"
    attempt.completed_at = datetime.utcnow()

    # Record category performance entry
    category_key = assessment.type.value if hasattr(assessment.type, "value") else str(assessment.type)
    perf_rec = PerformanceRecord(
        student_id=attempt.student_id,
        category=category_key,
        score=score_pct,
        recorded_at=datetime.utcnow()
    )
    db.add(perf_rec)
    await db.commit()

    # Generate custom result feedback
    strong_areas = []
    needs_improvement = []
    
    if score_pct >= 75:
        strong_areas.append(f"{assessment.category} Mastery")
        rec_action = f"Excellent performance! You scored {score_pct}%. Continue with advanced problem sets."
    else:
        needs_improvement.append(f"{assessment.category} Fundamentals")
        rec_action = f"Your score of {score_pct}% is below target. Review topic explanations and practice targeted exercises before re-attempting."

    return {
        "attempt_id": attempt.id,
        "score": score_pct,
        "total_questions": total_questions,
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "skipped_count": skipped_count,
        "status": "COMPLETED",
        "strong_areas": strong_areas,
        "needs_improvement": needs_improvement,
        "recommended_action": rec_action,
        "breakdown": question_breakdown
    }


@router.get("/{attempt_id}/result")
async def get_attempt_result(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve detailed scorecard and question-by-question analysis for a completed attempt."""
    stmt = (
        select(TestAttempt)
        .options(
            selectinload(TestAttempt.assessment)
        )
        .where(TestAttempt.id == attempt_id)
    )
    result = await db.execute(stmt)
    attempt = result.scalars().first()

    if not attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found.")

    if current_user.role == UserRole.STUDENT:
        if not current_user.student_profile or attempt.student_id != current_user.student_profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot view another student's results.")

    score = attempt.score
    total = attempt.correct_count + attempt.incorrect_count + attempt.skipped_count

    return {
        "attempt_id": attempt.id,
        "assessment_title": attempt.assessment.title if attempt.assessment else "Assessment",
        "category": attempt.assessment.category if attempt.assessment else "General",
        "score": score,
        "correct_count": attempt.correct_count,
        "incorrect_count": attempt.incorrect_count,
        "skipped_count": attempt.skipped_count,
        "total_questions": total if total > 0 else 10,
        "status": attempt.status,
        "completed_at": attempt.completed_at,
        "strong_areas": [f"{attempt.assessment.category} Application"] if score >= 70 else ["Basic Concepts"],
        "needs_improvement": ["Speed & Accuracy", "Complex Edge Cases"] if score < 75 else ["Advanced Problem Solving"],
        "recommended_action": f"Score: {score}%. Practice topic exercises before attempting the next placement mock test."
    }
