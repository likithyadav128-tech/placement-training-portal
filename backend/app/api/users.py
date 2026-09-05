from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User, UserRole
from app.models.academic import Student, Faculty, Department
from app.schemas.auth import UserOut, StudentProfileOut, FacultyProfileOut
from app.auth.dependencies import get_current_user, require_role, calculate_effective_permissions

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve current authenticated user profile."""
    permissions = await calculate_effective_permissions(current_user, db)
    
    student_profile = None
    if current_user.student_profile:
        student_profile = StudentProfileOut(
            id=current_user.student_profile.id,
            student_id=current_user.student_profile.student_id,
            department_id=current_user.student_profile.department_id,
            department_name=current_user.student_profile.department.name if current_user.student_profile.department else None,
            year=current_user.student_profile.year,
            section=current_user.student_profile.section,
            cgpa=current_user.student_profile.cgpa
        )

    faculty_profile = None
    if current_user.faculty_profile:
        faculty_profile = FacultyProfileOut(
            id=current_user.faculty_profile.id,
            employee_id=current_user.faculty_profile.employee_id,
            department_id=current_user.faculty_profile.department_id,
            department_name=current_user.faculty_profile.department.name if current_user.faculty_profile.department else None,
            designation=current_user.faculty_profile.designation
        )

    return UserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at,
        permissions=permissions,
        student_profile=student_profile,
        faculty_profile=faculty_profile
    )


@router.get("", response_model=List[UserOut])
async def list_users(
    role: Optional[UserRole] = None,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """List users across the institution (Management only)."""
    stmt = (
        select(User)
        .options(
            selectinload(User.student_profile).selectinload(Student.department),
            selectinload(User.faculty_profile).selectinload(Faculty.department),
        )
    )
    if role:
        stmt = stmt.where(User.role == role)

    result = await db.execute(stmt)
    users = result.scalars().all()

    items = []
    for u in users:
        perms = await calculate_effective_permissions(u, db)
        
        student_profile = None
        if u.student_profile:
            student_profile = StudentProfileOut(
                id=u.student_profile.id,
                student_id=u.student_profile.student_id,
                department_id=u.student_profile.department_id,
                department_name=u.student_profile.department.name if u.student_profile.department else None,
                year=u.student_profile.year,
                section=u.student_profile.section,
                cgpa=u.student_profile.cgpa
            )

        faculty_profile = None
        if u.faculty_profile:
            faculty_profile = FacultyProfileOut(
                id=u.faculty_profile.id,
                employee_id=u.faculty_profile.employee_id,
                department_id=u.faculty_profile.department_id,
                department_name=u.faculty_profile.department.name if u.faculty_profile.department else None,
                designation=u.faculty_profile.designation
            )

        items.append(UserOut(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            status=u.status,
            avatar_url=u.avatar_url,
            created_at=u.created_at,
            permissions=perms,
            student_profile=student_profile,
            faculty_profile=faculty_profile
        ))

    return items
