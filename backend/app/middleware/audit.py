from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog
from app.models.user import User


async def log_audit_event(
    db: AsyncSession,
    action: str,
    user: Optional[User] = None,
    target_type: Optional[str] = None,
    target_id: Optional[str] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None
):
    """Utility to persist an audit log entry in the database."""
    user_id = user.id if user else None
    user_email = user.email if user else "SYSTEM"
    user_role = (user.role.value if hasattr(user.role, "value") else str(user.role)) if user else "SYSTEM"

    audit_entry = AuditLog(
        user_id=user_id,
        user_email=user_email,
        user_role=user_role,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else None,
        details=details,
        ip_address=ip_address
    )
    db.add(audit_entry)
    await db.commit()
