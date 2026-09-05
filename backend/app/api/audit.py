from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogOut
from app.auth.dependencies import require_role

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get("", response_model=List[AuditLogOut])
async def list_audit_logs(
    action: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve immutable audit trail for administrative, permission, and security actions."""
    stmt = select(AuditLog).order_by(desc(AuditLog.timestamp))
    if action:
        stmt = stmt.where(AuditLog.action.ilike(f"%{action}%"))

    stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
