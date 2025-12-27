"""JWT token middleware and session management."""

from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.services.auth.better_auth import better_auth
from app.core.logging import get_logger

logger = get_logger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


class SessionManager:
    """Manages user sessions and token validation."""

    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db),
    ) -> User:
        """
        Dependency to get current authenticated user from JWT token.

        Usage in routes:
            @app.get("/protected")
            async def protected_route(user: User = Depends(get_current_user)):
                return {"user_id": user.id}

        Args:
            credentials: HTTP Bearer token credentials
            db: Database session

        Returns:
            User: Current authenticated user

        Raises:
            HTTPException: If token is invalid or user not found
        """
        token = credentials.credentials

        # Decode token
        payload = decode_access_token(token)
        if not payload:
            logger.warning("invalid_token_attempt")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Extract user ID from token
        user_id_str: Optional[str] = payload.get("sub")
        if not user_id_str:
            logger.warning("token_missing_user_id")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        try:
            user_id = UUID(user_id_str)
        except ValueError:
            logger.warning("token_invalid_user_id", user_id=user_id_str)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database
        user = await better_auth.get_user_by_id(db, user_id)
        if not user:
            logger.warning("token_user_not_found", user_id=str(user_id))
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user

    @staticmethod
    async def get_current_user_optional(
        credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
        db: AsyncSession = Depends(get_db),
    ) -> Optional[User]:
        """
        Dependency to get current user if authenticated, None otherwise.

        Useful for routes that work both authenticated and unauthenticated.

        Args:
            credentials: Optional HTTP Bearer token credentials
            db: Database session

        Returns:
            Optional[User]: Current user if authenticated, None otherwise
        """
        if not credentials:
            return None

        try:
            return await SessionManager.get_current_user(credentials, db)
        except HTTPException:
            return None


# Convenience function exports
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current authenticated user (convenience function)."""
    return await SessionManager.get_current_user(credentials, db)


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Get current user if authenticated, None otherwise (convenience function)."""
    return await SessionManager.get_current_user_optional(credentials, db)
