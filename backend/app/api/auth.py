import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.models.user import User, UserRole, UserStatus
from app.models.academic import Student, Faculty, Department
from app.models.role_permission import UserPermission, Permission
from app.schemas.auth import (
    LoginResponse,
    UserOut,
    StudentProfileOut,
    FacultyProfileOut,
    DevLoginRequest,
    MicrosoftAuthUrlResponse,
    MicrosoftCallbackRequest,
)
from app.auth.jwt_handler import create_access_token
from app.auth.dependencies import get_current_user, calculate_effective_permissions
from app.auth.ms_entra import get_microsoft_auth_url, acquire_token_by_auth_code, get_user_info_from_graph
from app.middleware.audit import log_audit_event

router = APIRouter(prefix="/auth", tags=["Authentication"])


def build_user_out(user: User, permissions: list[str]) -> UserOut:
    """Helper to convert User model to UserOut schema."""
    student_profile = None
    if user.student_profile:
        student_profile = StudentProfileOut(
            id=user.student_profile.id,
            student_id=user.student_profile.student_id,
            department_id=user.student_profile.department_id,
            department_name=user.student_profile.department.name if user.student_profile.department else None,
            year=user.student_profile.year,
            section=user.student_profile.section,
            cgpa=user.student_profile.cgpa
        )

    faculty_profile = None
    if user.faculty_profile:
        faculty_profile = FacultyProfileOut(
            id=user.faculty_profile.id,
            employee_id=user.faculty_profile.employee_id,
            department_id=user.faculty_profile.department_id,
            department_name=user.faculty_profile.department.name if user.faculty_profile.department else None,
            designation=user.faculty_profile.designation
        )

    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        permissions=permissions,
        student_profile=student_profile,
        faculty_profile=faculty_profile
    )


@router.get("/microsoft", response_model=MicrosoftAuthUrlResponse)
async def get_microsoft_login_url():
    """Generates the Microsoft Entra ID OpenID Connect login URL."""
    state = str(uuid.uuid4())
    auth_url = get_microsoft_auth_url(state)
    return MicrosoftAuthUrlResponse(auth_url=auth_url, state=state)


@router.post("/microsoft/callback", response_model=LoginResponse)
async def microsoft_callback(
    req: MicrosoftCallbackRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handles OAuth callback from Microsoft Entra ID, provisions/authenticates user, and issues secure JWT."""
    token_res = await acquire_token_by_auth_code(req.code)
    if not token_res or "access_token" not in token_res:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to authenticate with Microsoft Entra ID."
        )

    ms_user = await get_user_info_from_graph(token_res["access_token"])
    if not ms_user or "mail" not in ms_user and "userPrincipalName" not in ms_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to retrieve identity from Microsoft Graph."
        )

    email = (ms_user.get("mail") or ms_user.get("userPrincipalName", "")).lower()
    name = ms_user.get("displayName", email.split("@")[0])
    ms_oid = ms_user.get("id")

    # Look up user in database
    stmt = (
        select(User)
        .options(
            selectinload(User.student_profile).selectinload(Student.department),
            selectinload(User.faculty_profile).selectinload(Faculty.department),
        )
        .where(User.email == email)
    )
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        # Default institutional provisioning as STUDENT if not pre-registered
        user = User(
            name=name,
            email=email,
            role=UserRole.STUDENT,
            status=UserStatus.ACTIVE,
            microsoft_oid=ms_oid
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Create basic student profile
        student_prof = Student(
            user_id=user.id,
            student_id=f"STU{user.id:04d}",
            year=4,
            section="A",
            cgpa=8.0
        )
        db.add(student_prof)
        await db.commit()
    else:
        if user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated. Please contact Management."
            )
        user.microsoft_oid = ms_oid
        await db.commit()

    permissions = await calculate_effective_permissions(user, db)
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role.value})

    await log_audit_event(
        db=db,
        action="LOGIN_MICROSOFT",
        user=user,
        target_type="USER",
        target_id=str(user.id),
        details="User logged in via Microsoft Entra ID",
        ip_address=request.client.host if request.client else None
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=build_user_out(user, permissions)
    )


@router.post("/demo-login", response_model=LoginResponse)
async def demo_login(
    payload: DevLoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Institutional Fast-Login for development, testing, and multi-role evaluation."""
    email = payload.email.strip().lower()

    stmt = (
        select(User)
        .options(
            selectinload(User.student_profile).selectinload(Student.department),
            selectinload(User.faculty_profile).selectinload(Faculty.department),
        )
        .where(User.email == email)
    )
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email '{email}' not found in demo accounts."
        )

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated."
        )

    permissions = await calculate_effective_permissions(user, db)
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role.value})

    await log_audit_event(
        db=db,
        action="LOGIN_DEMO",
        user=user,
        target_type="USER",
        target_id=str(user.id),
        details=f"Fast login as {user.role.value}",
        ip_address=request.client.host if request.client else None
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=build_user_out(user, permissions)
    )


@router.get("/me", response_model=UserOut)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns the authenticated user's profile, role, and active permissions."""
    permissions = await calculate_effective_permissions(current_user, db)
    return build_user_out(current_user, permissions)


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    request: Request = None,
    db: AsyncSession = Depends(get_db)
):
    """Logs out the user and records audit log."""
    await log_audit_event(
        db=db,
        action="LOGOUT",
        user=current_user,
        target_type="USER",
        target_id=str(current_user.id),
        details="User logged out",
        ip_address=request.client.host if request and request.client else None
    )
    return {"message": "Successfully logged out."}
