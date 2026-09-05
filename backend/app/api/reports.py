import io
import csv
from typing import Optional
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User, UserRole
from app.models.academic import Student, Department
from app.auth.dependencies import require_role
from app.services.performance_service import PerformanceService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/export/csv")
async def export_student_performance_csv(
    department: Optional[str] = None,
    current_user: User = Depends(require_role(UserRole.MANAGEMENT)),
    db: AsyncSession = Depends(get_db)
):
    """Export complete student performance and placement readiness data as CSV."""
    stmt = (
        select(Student)
        .options(selectinload(Student.user), selectinload(Student.department))
    )
    if department:
        stmt = stmt.join(Department, Student.department_id == Department.id).where(Department.code == department)

    result = await db.execute(stmt)
    students = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Student ID",
        "Student Name",
        "Email",
        "Department",
        "Year",
        "Section",
        "CGPA",
        "Overall Readiness %",
        "Coding %",
        "Aptitude %",
        "Mock Tests %",
        "Placement Status"
    ])

    for s in students:
        summary = await PerformanceService.get_student_performance_summary(s.id, db)
        overall = summary["overall_score"]
        status_label = "Placement Ready" if overall >= 75 else ("Needs Support" if overall < 60 else "Moderate")

        writer.writerow([
            s.student_id,
            s.user.name if s.user else "N/A",
            s.user.email if s.user else "N/A",
            s.department.code if s.department else "N/A",
            s.year,
            s.section,
            s.cgpa,
            overall,
            summary["coding_score"],
            summary["aptitude_score"],
            summary["mock_score"],
            status_label
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=placement_performance_report.csv"}
    )
