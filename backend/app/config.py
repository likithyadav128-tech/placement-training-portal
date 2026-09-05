from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import json


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./placement_portal.db"

    # JWT & Session
    SECRET_KEY: str = "placement-training-portal-super-secure-session-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Microsoft Entra ID
    MICROSOFT_CLIENT_ID: str = "00000000-0000-0000-0000-000000000000"
    MICROSOFT_TENANT_ID: str = "common"
    MICROSOFT_CLIENT_SECRET: str = "replace_with_actual_entra_client_secret"
    MICROSOFT_REDIRECT_URI: str = "http://localhost:5173/auth/callback"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
