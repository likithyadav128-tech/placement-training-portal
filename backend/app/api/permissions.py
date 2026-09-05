from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User, UserRole
from app.models.role_permission import Permission, UserPermission, DEFAULT_ROLE_PERMISSIONS
from app.schemas.role_permission import PermissionOut, GrantRevokePermissionRequest
from app.auth.dependencies import get_current_user, require_role, calculate_effective_permissions
from app.middleware.audit import log_audit_event

router = APIRouter(prefix="/permissions", tags=["Permissions"])


@router.get("", response_model=List[PermissionOut])
async def list_all_permissions(
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """List all registered system permissions."""
    stmt = select(Permission).order_by(Permission.category, Permission.name)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/users/{user_id}")
async def get_user_permissions(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve detailed permission matrix for a specific user (role defaults + individual overrides)."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    target_user = result.scalars().first()

    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    all_perms_stmt = select(Permission).order_by(Permission.category, Permission.name)
    all_perms_res = await db.execute(all_perms_stmt)
    all_perms = all_perms_res.scalars().all()

    effective_perms = await calculate_effective_permissions(target_user, db)
    role_name = target_user.role.value if hasattr(target_user.role, "value") else str(target_user.role)
    default_role_perms = DEFAULT_ROLE_PERMISSIONS.get(role_name, [])

    # Get specific overrides
    ovr_stmt = (
        select(UserPermission)
        .where(UserPermission.user_id == user_id)
    )
    ovr_res = await db.execute(ovr_stmt)
    overrides_map = {up.permission_id: up.is_granted for up in ovr_res.scalars().all()}

    matrix = []
    for p in all_perms:
        is_default = p.code in default_role_perms
        has_override = p.id in overrides_map
        is_granted = overrides_map.get(p.id, is_default)

        matrix.append({
            "permission_id": p.id,
            "code": p.code,
            "name": p.name,
            "category": p.category,
            "description": p.description,
            "is_default_for_role": is_default,
            "has_override": has_override,
            "is_effective": is_granted
        })

    return {
        "user_id": target_user.id,
        "user_name": target_user.name,
        "user_email": target_user.email,
        "user_role": role_name,
        "permissions": matrix
    }


@router.post("/users/{user_id}/override")
async def override_user_permission(
    user_id: int,
    payload: GrantRevokePermissionRequest,
    request: Request,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Grant or revoke a granular permission override for a user and log to audit table."""
    # Find user
    u_stmt = select(User).where(User.id == user_id)
    u_res = await db.execute(u_stmt)
    target_user = u_res.scalars().first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Find permission
    p_stmt = select(Permission).where(Permission.code == payload.permission_code)
    p_res = await db.execute(p_stmt)
    permission = p_res.scalars().first()
    if not permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission code not recognized.")

    # Find existing override if any
    up_stmt = select(UserPermission).where(
        UserPermission.user_id == user_id,
        UserPermission.permission_id == permission.id
    )
    up_res = await db.execute(up_stmt)
    user_perm = up_res.scalars().first()

    action_name = "GRANT_PERMISSION" if payload.is_granted else "REVOKE_PERMISSION"

    if user_perm:
        user_perm.is_granted = payload.is_granted
        user_perm.granted_by_id = current_user.id
    else:
        user_perm = UserPermission(
            user_id=user_id,
            permission_id=permission.id,
            is_granted=payload.is_granted,
            granted_by_id=current_user.id
        )
        db.add(user_perm)

    await db.commit()

    # Log to audit table
    await log_audit_event(
        db=db,
        action=action_name,
        user=current_user,
        target_type="USER_PERMISSION",
        target_id=str(user_id),
        details=f"Management {current_user.email} {'granted' if payload.is_granted else 'revoked'} '{permission.code}' for user '{target_user.email}'",
        ip_address=request.client.host if request.client else None
    )

    return {
        "message": f"Successfully {'granted' if payload.is_granted else 'revoked'} permission '{permission.code}' for {target_user.name}."
    }
