import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_assessments_as_student(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/assessments", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    for a in data:
        assert a["status"] == "PUBLISHED"


@pytest.mark.asyncio
async def test_get_assessment_detail_with_questions(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/assessments/1", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["questions"]) >= 1
    # Check student does not see direct answers
    assert data["questions"][0]["answer"] is None


@pytest.mark.asyncio
async def test_sandboxed_code_execution(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    code = "def reverse_array(arr):\n    return arr[::-1]"
    res = await client.post(
        "/api/assessments/1/run-code",
        headers=headers,
        json={"code": code, "language": "python", "question_id": 1}
    )
    assert res.status_code == 200
    data = res.json()
    assert "score" in data
    assert "execution_time_ms" in data
    assert "memory_usage_mb" in data
    assert len(data["test_cases"]) > 0


@pytest.mark.asyncio
async def test_submit_test_attempt(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    
    # 1. Start attempt for assessment 2 (Aptitude)
    start_res = await client.post("/api/attempts/start", headers=headers, json={"assessment_id": 2})
    assert start_res.status_code == 200
    attempt_id = start_res.json()["attempt_id"]

    # 2. Submit answers
    submit_res = await client.post(
        f"/api/attempts/{attempt_id}/submit",
        headers=headers,
        json={
            "answers": {
                "4": "150 metres",
                "5": "6 days"
            }
        }
    )
    assert submit_res.status_code == 200
    data = submit_res.json()
    assert data["status"] == "COMPLETED"
    assert "score" in data
    assert "breakdown" in data


@pytest.mark.asyncio
async def test_student_roadmap(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/students/1/roadmap", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "steps" in data
    assert len(data["steps"]) >= 5


@pytest.mark.asyncio
async def test_student_analysis_and_recommendations(client: AsyncClient, student_token: str):
    headers = {"Authorization": f"Bearer {student_token}"}
    res = await client.get("/api/students/1/analysis", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "strengths" in data
    assert "weak_areas" in data
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    # Recommendation must contain an actionable reason
    assert "message" in data["recommendations"][0]


@pytest.mark.asyncio
async def test_management_csv_export(client: AsyncClient, management_token: str):
    headers = {"Authorization": f"Bearer {management_token}"}
    res = await client.get("/api/reports/export/csv", headers=headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert "Student ID,Student Name" in res.text
