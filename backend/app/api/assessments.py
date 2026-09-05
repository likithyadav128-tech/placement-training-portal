from typing import Optional, List, Dict, Any
import json
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User, UserRole
from app.models.assessments import (
    Assessment,
    AssessmentType,
    AssessmentStatus,
    Question,
    AssessmentQuestion,
    TestAttempt
)
from app.auth.dependencies import get_current_user, require_role, require_permission
from app.services.code_runner_service import CodeRunnerService
from app.middleware.audit import log_audit_event

router = APIRouter(prefix="/assessments", tags=["Assessments"])


class CodeRunRequest(BaseModel):
    code: str
    language: str
    question_id: int


class AssessmentCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    type: AssessmentType
    category: str
    difficulty: str = "Medium"
    duration: int = 60
    passing_score: float = 60.0


class QuestionCreateRequest(BaseModel):
    question: str
    type: str = "MCQ"
    category: str
    difficulty: str = "Medium"
    marks: float = 1.0
    options: Optional[List[str]] = None
    answer: str
    explanation: Optional[str] = None
    code_template: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None


@router.get("")
async def list_assessments(
    type: Optional[AssessmentType] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve catalog of assessments. Students only see PUBLISHED; Faculty/Management see all."""
    stmt = (
        select(Assessment)
        .options(
            selectinload(Assessment.questions).selectinload(AssessmentQuestion.question),
            selectinload(Assessment.attempts)
        )
    )

    if current_user.role == UserRole.STUDENT:
        stmt = stmt.where(Assessment.status == AssessmentStatus.PUBLISHED)

    if type:
        stmt = stmt.where(Assessment.type == type)

    if category:
        stmt = stmt.where(Assessment.category.ilike(f"%{category}%"))

    if difficulty:
        stmt = stmt.where(Assessment.difficulty == difficulty)

    if search:
        stmt = stmt.where(
            or_(
                Assessment.title.ilike(f"%{search}%"),
                Assessment.category.ilike(f"%{search}%")
            )
        )

    stmt = stmt.order_by(Assessment.created_at.desc())
    result = await db.execute(stmt)
    assessments = result.scalars().all()

    # If student, check if they have already attempted each assessment
    student_id = current_user.student_profile.id if current_user.student_profile else None

    items = []
    for a in assessments:
        user_attempt = None
        if student_id:
            for att in a.attempts:
                if att.student_id == student_id:
                    user_attempt = {
                        "id": att.id,
                        "score": att.score,
                        "status": att.status,
                        "completed_at": att.completed_at
                    }
                    break

        items.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "type": a.type.value,
            "category": a.category,
            "difficulty": a.difficulty,
            "duration": a.duration,
            "passing_score": a.passing_score,
            "questions_count": len(a.questions),
            "status": a.status.value,
            "user_attempt": user_attempt
        })

    return items


@router.get("/{assessment_id}")
async def get_assessment_detail(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve complete assessment data with ordered questions."""
    stmt = (
        select(Assessment)
        .options(
            selectinload(Assessment.questions).selectinload(AssessmentQuestion.question)
        )
        .where(Assessment.id == assessment_id)
    )
    result = await db.execute(stmt)
    assessment = result.scalars().first()

    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found.")

    if current_user.role == UserRole.STUDENT and assessment.status != AssessmentStatus.PUBLISHED:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Assessment is not currently published.")

    # Sort questions by order_index
    sorted_aq = sorted(assessment.questions, key=lambda x: x.order_index)

    question_list = []
    for aq in sorted_aq:
        q = aq.question
        options = []
        if q.options:
            try:
                options = json.loads(q.options)
            except Exception:
                options = [q.options]

        test_cases = []
        if q.test_cases:
            try:
                tc_data = json.loads(q.test_cases)
                # Hide confidential/hidden test case outputs from students
                if current_user.role == UserRole.STUDENT:
                    test_cases = [
                        {"input": tc.get("input"), "expected_output": tc.get("expected_output") if not tc.get("is_hidden") else "[Hidden]", "is_hidden": tc.get("is_hidden", False)}
                        for tc in tc_data
                    ]
                else:
                    test_cases = tc_data
            except Exception:
                pass

        question_list.append({
            "id": q.id,
            "order": aq.order_index,
            "question": q.question,
            "type": q.type,
            "category": q.category,
            "difficulty": q.difficulty,
            "marks": q.marks,
            "options": options,
            "code_template": q.code_template,
            "test_cases": test_cases,
            # For students taking test, hide direct answers unless completed
            "answer": q.answer if current_user.role != UserRole.STUDENT else None,
            "explanation": q.explanation if current_user.role != UserRole.STUDENT else None
        })

    return {
        "id": assessment.id,
        "title": assessment.title,
        "description": assessment.description,
        "type": assessment.type.value,
        "category": assessment.category,
        "difficulty": assessment.difficulty,
        "duration": assessment.duration,
        "passing_score": assessment.passing_score,
        "status": assessment.status.value,
        "questions": question_list
    }


@router.post("/{assessment_id}/run-code")
async def run_assessment_code(
    assessment_id: int,
    payload: CodeRunRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Safely runs student code against test cases in an execution sandbox."""
    stmt = select(Question).where(Question.id == payload.question_id)
    result = await db.execute(stmt)
    q = result.scalars().first()

    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")

    execution_result = CodeRunnerService.execute_code(
        code=payload.code,
        language=payload.language,
        test_cases_json=q.test_cases or "[]"
    )

    return execution_result


@router.post("")
async def create_assessment(
    payload: AssessmentCreateRequest,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Create a new assessment (Management only)."""
    assessment = Assessment(
        title=payload.title,
        description=payload.description,
        type=payload.type,
        category=payload.category,
        difficulty=payload.difficulty,
        duration=payload.duration,
        passing_score=payload.passing_score,
        status=AssessmentStatus.PUBLISHED,
        created_by_id=current_user.id
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)

    await log_audit_event(
        db=db,
        action="CREATE_ASSESSMENT",
        user=current_user,
        target_type="ASSESSMENT",
        target_id=str(assessment.id),
        details=f"Created assessment '{assessment.title}'"
    )

    return {"message": "Assessment created successfully.", "id": assessment.id}
