import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    FACULTY = "FACULTY"
    MANAGEMENT = "MANAGEMENT"


class UserStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.ACTIVE)
    avatar_url = Column(String(500), nullable=True)
    microsoft_oid = Column(String(100), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    student_profile = relationship(
        "Student",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        foreign_keys="[Student.user_id]"
    )
    faculty_profile = relationship(
        "Faculty",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        foreign_keys="[Faculty.user_id]"
    )
    user_permissions = relationship(
        "UserPermission",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys="[UserPermission.user_id]"
    )
    audit_logs = relationship(
        "AuditLog",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys="[AuditLog.user_id]"
    )

    def __repr__(self):
        return f"<User id={self.id} email='{self.email}' role='{self.role}'>"
