from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


# Standard default permissions for each role
DEFAULT_ROLE_PERMISSIONS = {
    "STUDENT": [
        "VIEW_OWN_PERFORMANCE",
        "TAKE_ASSESSMENT",
        "TAKE_MOCK_TEST",
        "VIEW_ROADMAP",
        "VIEW_RECOMMENDATIONS",
    ],
    "FACULTY": [
        "VIEW_ASSIGNED_STUDENTS",
        "VIEW_STUDENT_PERFORMANCE",
        "VIEW_STUDENT_RESULTS",
        "VIEW_ANALYTICS",
    ],
    "MANAGEMENT": [
        "VIEW_OWN_PERFORMANCE",
        "TAKE_ASSESSMENT",
        "TAKE_MOCK_TEST",
        "VIEW_ROADMAP",
        "VIEW_RECOMMENDATIONS",
        "VIEW_ASSIGNED_STUDENTS",
        "VIEW_STUDENT_PERFORMANCE",
        "VIEW_STUDENT_RESULTS",
        "VIEW_ANALYTICS",
        "MANAGE_STUDENTS",
        "MANAGE_FACULTY",
        "MANAGE_ASSESSMENTS",
        "MANAGE_MOCK_TESTS",
        "MANAGE_ROADMAPS",
        "MANAGE_PERMISSIONS",
        "VIEW_INSTITUTION_ANALYTICS",
        "MANAGE_SETTINGS",
    ]
}


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    category = Column(String(100), nullable=False, default="GENERAL")

    user_overrides = relationship("UserPermission", back_populates="permission", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Permission code='{self.code}'>"


class UserPermission(Base):
    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    permission_id = Column(Integer, ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False)
    is_granted = Column(Boolean, nullable=False, default=True)  # True = Granted override, False = Revoked override
    granted_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'permission_id', name='uix_user_permission'),
    )

    user = relationship("User", foreign_keys=[user_id], back_populates="user_permissions")
    permission = relationship("Permission", back_populates="user_overrides")
    granted_by = relationship("User", foreign_keys=[granted_by_id])
