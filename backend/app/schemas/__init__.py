from app.schemas.auth import (
    TokenPayload,
    UserOut,
    StudentProfileOut,
    FacultyProfileOut,
    LoginResponse,
    MicrosoftAuthUrlResponse,
    MicrosoftCallbackRequest,
    DevLoginRequest,
)
from app.schemas.role_permission import (
    PermissionOut,
    UserPermissionOut,
    GrantRevokePermissionRequest,
)
from app.schemas.audit import AuditLogOut, AuditLogCreate

__all__ = [
    "TokenPayload",
    "UserOut",
    "StudentProfileOut",
    "FacultyProfileOut",
    "LoginResponse",
    "MicrosoftAuthUrlResponse",
    "MicrosoftCallbackRequest",
    "DevLoginRequest",
    "PermissionOut",
    "UserPermissionOut",
    "GrantRevokePermissionRequest",
    "AuditLogOut",
    "AuditLogCreate",
]
