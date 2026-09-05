import pytest
import asyncio
import httpx
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import engine, Base, AsyncSessionLocal
from app.seed.seed_data import seed_database


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def prepare_db():
    await seed_database()
    yield
    await engine.dispose()


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def student_token(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "student1@institution.edu"})
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.fixture
async def student2_token(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "student2@institution.edu"})
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.fixture
async def faculty_token(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "prof.sharma@institution.edu"})
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.fixture
async def management_token(client: AsyncClient):
    res = await client.post("/api/auth/demo-login", json={"email": "admin@institution.edu"})
    assert res.status_code == 200
    return res.json()["access_token"]
