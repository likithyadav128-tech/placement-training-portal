from typing import Optional, Dict, Any
import httpx
from msal import ConfidentialClientApplication
from app.config import settings


def get_msal_app() -> ConfidentialClientApplication:
    return ConfidentialClientApplication(
        client_id=settings.MICROSOFT_CLIENT_ID,
        client_credential=settings.MICROSOFT_CLIENT_SECRET,
        authority=f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}"
    )


def get_microsoft_auth_url(state: str) -> str:
    """Generate Microsoft Entra ID authorization URL."""
    msal_app = get_msal_app()
    auth_url = msal_app.get_authorization_request_url(
        scopes=["User.Read", "openid", "profile", "email"],
        redirect_uri=settings.MICROSOFT_REDIRECT_URI,
        state=state
    )
    return auth_url


async def acquire_token_by_auth_code(code: str) -> Optional[Dict[str, Any]]:
    """Exchange authorization code for Microsoft tokens."""
    msal_app = get_msal_app()
    result = msal_app.acquire_token_by_authorization_code(
        code=code,
        scopes=["User.Read", "openid", "profile", "email"],
        redirect_uri=settings.MICROSOFT_REDIRECT_URI
    )
    if "error" in result:
        return None
    return result


async def get_user_info_from_graph(access_token: str) -> Optional[Dict[str, Any]]:
    """Fetch user profile from Microsoft Graph API."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return response.json()
        return None
