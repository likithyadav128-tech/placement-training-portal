from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.assessments import TestAttempt, PerformanceRecord, Assessment
from app.models.academic import Student


# Centralized configurable scoring weights for placement readiness
SCORING_WEIGHTS = {
    "CODING": 0.30,         # 30%
    "APTITUDE": 0.25,       # 25%
    "TECHNICAL": 0.20,      # 20%
    "MOCK": 0.15,           # 15%
    "COMMUNICATION": 0.10,  # 10%
}


class PerformanceService:
    @staticmethod
    def calculate_overall_readiness(scores: Dict[str, float]) -> float:
        """Calculates weighted overall placement readiness percentage."""
        overall = (
            scores.get("CODING", 0.0) * SCORING_WEIGHTS["CODING"] +
            scores.get("APTITUDE", 0.0) * SCORING_WEIGHTS["APTITUDE"] +
            scores.get("TECHNICAL", 0.0) * SCORING_WEIGHTS["TECHNICAL"] +
            scores.get("MOCK", 0.0) * SCORING_WEIGHTS["MOCK"] +
            scores.get("COMMUNICATION", 70.0) * SCORING_WEIGHTS["COMMUNICATION"]
        )
        return round(overall, 1)

    @staticmethod
    async def get_student_performance_summary(student_id: int, db: AsyncSession) -> Dict[str, Any]:
        """Fetches the category breakdown, overall readiness, trends, and recent test attempts for a student."""
        # Query all test attempts
        stmt = (
            select(TestAttempt, Assessment)
            .join(Assessment, TestAttempt.assessment_id == Assessment.id)
            .where(TestAttempt.student_id == student_id)
            .order_by(TestAttempt.completed_at.desc())
        )
        result = await db.execute(stmt)
        attempts = result.all()

        # Categorize attempts
        category_scores: Dict[str, List[float]] = {
            "CODING": [],
            "APTITUDE": [],
            "TECHNICAL": [],
            "MOCK": []
        }

        recent_activity = []
        for attempt, assessment in attempts:
            cat = assessment.type.value if hasattr(assessment.type, "value") else str(assessment.type)
            if cat in category_scores:
                category_scores[cat].append(attempt.score)
            else:
                category_scores["TECHNICAL"].append(attempt.score)

            if len(recent_activity) < 5:
                recent_activity.append({
                    "id": attempt.id,
                    "title": assessment.title,
                    "category": assessment.category,
                    "type": cat,
                    "score": attempt.score,
                    "status": attempt.status,
                    "completed_at": attempt.completed_at.strftime("%Y-%m-%d %H:%M") if attempt.completed_at else None,
                    "duration_mins": assessment.duration
                })

        # Calculate average score per category (or fallback to defaults if no attempts yet)
        avg_scores = {
            "CODING": round(sum(category_scores["CODING"]) / len(category_scores["CODING"]), 1) if category_scores["CODING"] else 75.0,
            "APTITUDE": round(sum(category_scores["APTITUDE"]) / len(category_scores["APTITUDE"]), 1) if category_scores["APTITUDE"] else 70.0,
            "TECHNICAL": round(sum(category_scores["TECHNICAL"]) / len(category_scores["TECHNICAL"]), 1) if category_scores["TECHNICAL"] else 72.0,
            "MOCK": round(sum(category_scores["MOCK"]) / len(category_scores["MOCK"]), 1) if category_scores["MOCK"] else 68.0,
            "COMMUNICATION": 78.0
        }

        overall_readiness = PerformanceService.calculate_overall_readiness(avg_scores)

        # Performance history timeline for charts
        history_stmt = (
            select(PerformanceRecord)
            .where(PerformanceRecord.student_id == student_id)
            .order_by(PerformanceRecord.recorded_at.asc())
        )
        hist_res = await db.execute(history_stmt)
        records = hist_res.scalars().all()

        timeline = []
        for rec in records:
            timeline.append({
                "date": rec.recorded_at.strftime("%b %d"),
                "category": rec.category,
                "score": rec.score
            })

        return {
            "overall_score": overall_readiness,
            "coding_score": avg_scores["CODING"],
            "aptitude_score": avg_scores["APTITUDE"],
            "technical_score": avg_scores["TECHNICAL"],
            "mock_score": avg_scores["MOCK"],
            "communication_score": avg_scores["COMMUNICATION"],
            "weights": SCORING_WEIGHTS,
            "total_assessments_taken": len(attempts),
            "recent_activity": recent_activity,
            "timeline": timeline
        }
