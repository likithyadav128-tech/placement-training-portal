from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.models.user import User, UserRole, UserStatus
from app.models.academic import Student, Faculty, Department
from app.models.assessments import Assessment, TestAttempt
from app.auth.dependencies import require_role
from app.services.performance_service import PerformanceService, SCORING_WEIGHTS
from app.middleware.audit import log_audit_event

router = APIRouter(prefix="/management", tags=["Management"])


class UserStatusUpdateRequest(BaseModel):
    status: UserStatus


class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    department_code: str
    # Student specific
    year: Optional[int] = 4
    section: Optional[str] = "A"
    cgpa: Optional[float] = 8.0
    # Faculty specific
    designation: Optional[str] = "Assistant Professor"


@router.get("/analytics")
async def get_institution_analytics(
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Provides institution-wide KPIs, department performance rankings, and student readiness metrics."""
    # Count totals
    total_students_res = await db.execute(select(func.count(Student.id)))
    total_students = total_students_res.scalar() or 0

    total_faculty_res = await db.execute(select(func.count(Faculty.id)))
    total_faculty = total_faculty_res.scalar() or 0

    # Query all students with their performance
    stmt = select(Student).options(selectinload(Student.user), selectinload(Student.department))
    result = await db.execute(stmt)
    students = result.scalars().all()

    scores = []
    ready_count = 0
    needs_attention = []

    dept_scores_map = {}

    for s in students:
        summary = await PerformanceService.get_student_performance_summary(s.id, db)
        overall = summary["overall_score"]
        scores.append(overall)

        if overall >= 75:
            ready_count += 1
        elif overall < 60:
            needs_attention.append({
                "id": s.id,
                "student_id": s.student_id,
                "name": s.user.name if s.user else "Student",
                "department": s.department.code if s.department else "N/A",
                "year": s.year,
                "section": s.section,
                "overall_score": overall,
                "coding_score": summary["coding_score"],
                "aptitude_score": summary["aptitude_score"],
                "reason": f"Overall score {overall}% below threshold"
            })

        dept_code = s.department.code if s.department else "OTHER"
        if dept_code not in dept_scores_map:
            dept_scores_map[dept_code] = []
        dept_scores_map[dept_code].append(overall)

    avg_performance = round(sum(scores) / len(scores), 1) if scores else 0.0
    placement_readiness = round((ready_count / len(scores)) * 100, 1) if scores else 0.0

    department_performance = [
        {
            "code": code,
            "avg_score": round(sum(sc) / len(sc), 1),
            "student_count": len(sc),
            "placement_ready_rate": round((len([x for x in sc if x >= 75]) / len(sc)) * 100, 1)
        }
        for code, sc in dept_scores_map.items()
    ]

    return {
        "overview": {
            "total_students": total_students,
            "total_faculty": total_faculty,
            "average_performance": avg_performance,
            "placement_readiness_rate": placement_readiness,
            "assessment_completion_rate": 88.5
        },
        "department_performance": department_performance,
        "students_needing_attention": sorted(needs_attention, key=lambda x: x["overall_score"])[:10],
        "readiness_distribution": {
            "tier_1_ready": ready_count,
            "tier_2_moderate": len([s for s in scores if 60 <= s < 75]),
            "tier_3_needs_attention": len([s for s in scores if s < 60])
        }
    }


@router.post("/users")
async def create_institutional_user(
    payload: CreateUserRequest,
    request: Request,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Provision a new Student or Faculty member into the institution."""
    # Check duplicate
    existing = await db.execute(select(User).where(User.email == payload.email.lower()))
    if existing.scalars().first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    # Find department
    dept_res = await db.execute(select(Department).where(Department.code == payload.department_code.upper()))
    dept = dept_res.scalars().first()

    new_user = User(
        name=payload.name,
        email=payload.email.lower(),
        role=payload.role,
        status=UserStatus.ACTIVE
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    if payload.role == UserRole.STUDENT:
        student_prof = Student(
            user_id=new_user.id,
            student_id=f"STU{new_user.id:04d}",
            department_id=dept.id if dept else None,
            year=payload.year or 4,
            section=payload.section or "A",
            cgpa=payload.cgpa or 8.0
        )
        db.add(student_prof)
    elif payload.role == UserRole.FACULTY:
        faculty_prof = Faculty(
            user_id=new_user.id,
            employee_id=f"EMP{new_user.id:04d}",
            department_id=dept.id if dept else None,
            designation=payload.designation or "Assistant Professor"
        )
        db.add(faculty_prof)

    await db.commit()

    await log_audit_event(
        db=db,
        action=f"CREATE_{payload.role.value}",
        user=current_user,
        target_type="USER",
        target_id=str(new_user.id),
        details=f"Created {payload.role.value} account for {new_user.name} ({new_user.email})",
        ip_address=request.client.host if request.client else None
    )

    return {"message": "User provisioned successfully.", "user_id": new_user.id}


@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    payload: UserStatusUpdateRequest,
    request: Request,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Deactivate or reactivate user without deleting historical academic records."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot modify your own active status.")

    prev_status = user.status.value
    user.status = payload.status
    await db.commit()

    await log_audit_event(
        db=db,
        action="UPDATE_USER_STATUS",
        user=current_user,
        target_type="USER",
        target_id=str(user.id),
        details=f"Changed status of user '{user.email}' from {prev_status} to {payload.status.value}",
        ip_address=request.client.host if request.client else None
    )

    return {"message": f"User status successfully updated to {payload.status.value}."}


@router.get("/settings")
async def get_system_settings(
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
):
    """Retrieve global placement scoring weights and institutional criteria."""
    return {
        "scoring_weights": SCORING_WEIGHTS,
        "placement_readiness_threshold": 75.0,
        "at_risk_threshold": 60.0,
        "default_pass_mark": 60.0,
        "version": "1.0.0",
        "institution_name": "Placement Training Portal System"
    }
