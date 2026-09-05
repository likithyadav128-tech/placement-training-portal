from typing import List, Callable, Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.auth.jwt_handler import decode_access_token
from app.models.user import User, UserRole, UserStatus
from app.models.role_permission import Permission, UserPermission, DEFAULT_ROLE_PERMISSIONS
from app.models.academic import Student, Faculty, Department

security = HTTPBearer(auto_error=False)


async def calculate_effective_permissions(user: User, db: AsyncSession) -> List[str]:
    """Calculate the final list of permissions for a user considering role defaults and explicit overrides."""
    # 1. Start with role defaults
    role_name = user.role.value if hasattr(user.role, "value") else str(user.role)
    base_permissions = set(DEFAULT_ROLE_PERMISSIONS.get(role_name, []))

    # 2. Query explicit database overrides for this user
    stmt = (
        select(UserPermission, Permission)
        .join(Permission, UserPermission.permission_id == Permission.id)
        .where(UserPermission.user_id == user.id)
    )
    result = await db.execute(stmt)
    overrides = result.all()

    for up, perm in overrides:
        if up.is_granted:
            base_permissions.add(perm.code)
        else:
            base_permissions.discard(perm.code)

    return sorted(list(base_permissions))


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Validate Bearer token, fetch user from database with full relationship graphs, and verify active status."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = int(payload["sub"])
    stmt = (
        select(User)
        .options(
            selectinload(User.student_profile).selectinload(Student.department),
            selectinload(User.faculty_profile).selectinload(Faculty.department),
            selectinload(User.user_permissions).selectinload(UserPermission.permission),
        )
        .where(User.id == user_id)
    )
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact Management.",
        )

    # Attach computed effective permissions for fast in-request access
    user.effective_permissions = await calculate_effective_permissions(user, db)
    return user


def require_role(*allowed_roles: UserRole):
    """Enforces that the authenticated user possesses one of the authorized roles."""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role_str = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
        allowed_role_strs = [r.value if hasattr(r, "value") else str(r) for r in allowed_roles]
        
        if user_role_str not in allowed_role_strs:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. This endpoint requires one of the following roles: {', '.join(allowed_role_strs)}."
            )
        return current_user
    return role_checker


def require_permission(permission_code: str):
    """Enforces that the user has a specific granular permission."""
    async def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        if permission_code not in getattr(current_user, "effective_permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Missing required permission: '{permission_code}'."
            )
        return current_user
    return permission_checker
