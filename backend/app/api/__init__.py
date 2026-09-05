from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.students import router as students_router
from app.api.faculty import router as faculty_router
from app.api.assessments import router as assessments_router
from app.api.attempts import router as attempts_router
from app.api.roadmaps import router as roadmaps_router
from app.api.permissions import router as permissions_router
from app.api.management import router as management_router
from app.api.audit import router as audit_router
from app.api.reports import router as reports_router
from app.api.health import router as health_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(students_router)
api_router.include_router(faculty_router)
api_router.include_router(assessments_router)
api_router.include_router(attempts_router)
api_router.include_router(roadmaps_router)
api_router.include_router(permissions_router)
api_router.include_router(management_router)
api_router.include_router(audit_router)
api_router.include_router(reports_router)
