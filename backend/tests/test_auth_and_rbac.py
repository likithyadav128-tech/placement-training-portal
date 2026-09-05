import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    res = await client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_demo_login_student(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "student1@institution.edu"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "STUDENT"
    assert data["user"]["student_profile"]["student_id"] == "2022CSE101"


@pytest.mark.asyncio
async def test_demo_login_faculty(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "prof.sharma@institution.edu"})
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "FACULTY"
    assert "VIEW_ASSIGNED_STUDENTS" in data["user"]["permissions"]


@pytest.mark.asyncio
async def test_demo_login_management(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "admin@institution.edu"})
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "MANAGEMENT"
    assert "MANAGE_STUDENTS" in data["user"]["permissions"]


@pytest.mark.asyncio
async def test_invalid_login(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "nonexistent@institution.edu"})
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_student_cannot_access_faculty_endpoints(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/faculty/dashboard", headers=headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_student_cannot_access_management_endpoints(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/management/analytics", headers=headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_faculty_cannot_access_management_endpoints(client: AsyncClient, faculty_token: str):
    headers = {"Authorization": f"Bearer {faculty_token}"}
    res = await client.get("/api/management/analytics", headers=headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_student_cannot_access_other_student_data(client: AsyncClient, student_token: str):
    # Student 1 is id 1. Trying to access student 2's performance:
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/students/2/performance", headers=headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_student_can_access_own_data(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/students/1/performance", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "overall_score" in data
    assert "coding_score" in data
    assert "aptitude_score" in data


@pytest.mark.asyncio
async def test_management_can_grant_revoke_permission(client: AsyncClient, management_token: str):
    headers = {"Authorization": f"Bearer {management_token}"}
    
    # 1. Fetch user permissions for faculty (user_id = 2)
    res = await client.get("/api/permissions/users/2", headers=headers)
    assert res.status_code == 200

    # 2. Grant MANAGE_ASSESSMENTS override to Faculty
    grant_res = await client.post(
        "/api/permissions/users/2/override",
        headers=headers,
        json={"permission_code": "MANAGE_ASSESSMENTS", "is_granted": True}
    )
    assert grant_res.status_code == 200

    # 3. Verify audit log was created
    audit_res = await client.get("/api/audit-logs", headers=headers)
    assert audit_res.status_code == 200
    assert len(audit_res.json()) > 0
