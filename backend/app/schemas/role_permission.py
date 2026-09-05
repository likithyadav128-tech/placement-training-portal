from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class PermissionOut(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    category: str

    class Config:
        from_attributes = True


class UserPermissionOut(BaseModel):
    id: int
    user_id: int
    permission_id: int
    permission_code: str
    permission_name: str
    is_granted: bool
    granted_by_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class GrantRevokePermissionRequest(BaseModel):
    permission_code: str
    is_granted: bool  # True to grant explicit override, False to revoke
