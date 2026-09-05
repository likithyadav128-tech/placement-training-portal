from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole, UserStatus


class TokenPayload(BaseModel):
    sub: str  # user id as string
    email: str
    role: str
    exp: int


class StudentProfileOut(BaseModel):
    id: int
    student_id: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    year: int
    section: str
    cgpa: float

    class Config:
        from_attributes = True


class FacultyProfileOut(BaseModel):
    id: int
    employee_id: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    designation: str

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    status: UserStatus
    avatar_url: Optional[str] = None
    created_at: datetime
    permissions: List[str] = []
    student_profile: Optional[StudentProfileOut] = None
    faculty_profile: Optional[FacultyProfileOut] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class MicrosoftAuthUrlResponse(BaseModel):
    auth_url: str
    state: str


class MicrosoftCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None


class DevLoginRequest(BaseModel):
    email: EmailStr
