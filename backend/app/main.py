import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.future import select

from app.config import settings
from app.database import engine, Base, AsyncSessionLocal
from app.models.user import User
from app.api import api_router
from app.middleware.security import SecurityHeadersMiddleware
from app.seed.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Check if database has users, if not auto-seed demo data
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User))
        first_user = res.scalars().first()
        if not first_user:
            print("No existing records detected. Auto-seeding database with institutional demo data...")
            await seed_database()
        else:
            print("Database already populated.")

    yield
    # Shutdown tasks if needed
    await engine.dispose()


app = FastAPI(
    title="Placement Training Portal API",
    description="Enterprise Backend for College & University Placement Training, Assessments & Analytics",
    version="1.0.0",
    lifespan=lifespan
)

# 1. Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Standardized Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(l) for l in err.get("loc", [])])
        msg = err.get("msg", "Invalid value")
        errors.append(f"{loc}: {msg}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Input validation error", "errors": errors}
    )

# 4. Standardized Generic Exception Handler (Ensures NO raw stack traces leak)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # In development mode, print internal error for debugging
    if settings.DEBUG:
        print(f"Unhandled Exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact the system administrator."}
    )

# 5. Include API Routers with prefix /api
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "portal": "Placement Training Web Application",
        "status": "online",
        "documentation": "/docs",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
