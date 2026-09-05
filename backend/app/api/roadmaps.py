from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User, UserRole
from app.models.assessments import Roadmap, RoadmapStep
from app.auth.dependencies import get_current_user, require_role
from app.middleware.audit import log_audit_event

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])


class RoadmapStepCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_score: float = 75.0
    order_index: int = 1


class RoadmapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    steps: List[RoadmapStepCreate] = []


@router.get("")
async def list_roadmaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all available institutional roadmaps."""
    stmt = select(Roadmap).options(selectinload(Roadmap.steps))
    result = await db.execute(stmt)
    roadmaps = result.scalars().all()

    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "steps_count": len(r.steps),
            "steps": [
                {
                    "id": s.id,
                    "title": s.title,
                    "description": s.description,
                    "target_score": s.target_score,
                    "order_index": s.order_index
                }
                for s in sorted(r.steps, key=lambda x: x.order_index)
            ]
        }
        for r in roadmaps
    ]


@router.post("")
async def create_roadmap(
    payload: RoadmapCreate,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Create a new institutional roadmap (Management only)."""
    roadmap = Roadmap(title=payload.title, description=payload.description)
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)

    for idx, s in enumerate(payload.steps):
        step = RoadmapStep(
            roadmap_id=roadmap.id,
            title=s.title,
            description=s.description,
            target_score=s.target_score,
            order_index=s.order_index or (idx + 1)
        )
        db.add(step)

    await db.commit()

    await log_audit_event(
        db=db,
        action="CREATE_ROADMAP",
        user=current_user,
        target_type="ROADMAP",
        target_id=str(roadmap.id),
        details=f"Created roadmap '{roadmap.title}' with {len(payload.steps)} steps"
    )

    return {"message": "Roadmap created successfully.", "id": roadmap.id}
