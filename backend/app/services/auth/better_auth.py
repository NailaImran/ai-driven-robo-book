"""Better-Auth integration for authentication and authorization."""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.personalization import UserPreference
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.logging import get_logger

logger = get_logger(__name__)


class BetterAuthService:
    """Service for Better-Auth authentication operations."""

    @staticmethod
    async def create_user(
        db: AsyncSession,
        email: str,
        password: str,
        full_name: Optional[str] = None,
        software_background: Optional[str] = None,
        hardware_background: Optional[str] = None,
        learning_goal: Optional[str] = None,
    ) -> User:
        """
        Create a new user with hashed password and initial preferences.

        Args:
            db: Database session
            email: User email
            password: Plain text password (will be hashed)
            full_name: Optional full name
            software_background: Optional software background from signup questions
            hardware_background: Optional hardware background from signup questions
            learning_goal: Optional learning goal from signup questions

        Returns:
            User: Created user object

        Raises:
            ValueError: If user with email already exists
        """
        # Check if user already exists
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            logger.warning("signup_attempt_duplicate_email", email=email)
            raise ValueError(f"User with email {email} already exists")

        # Hash password with bcrypt (12 rounds per Constitution)
        hashed_password = hash_password(password)

        # Create user
        user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name,
        )
        db.add(user)
        await db.flush()  # Flush to get user.id

        # Create initial user preferences
        preference = UserPreference(
            user_id=user.id,
            software_background=software_background,
            hardware_background=hardware_background,
            learning_goal=learning_goal,
            language_preference="en",
        )
        db.add(preference)

        await db.commit()
        await db.refresh(user)

        logger.info("user_created", user_id=str(user.id), email=email)

        return user

    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password: str,
    ) -> Optional[User]:
        """
        Authenticate a user with email and password.

        Args:
            db: Database session
            email: User email
            password: Plain text password

        Returns:
            Optional[User]: User object if authenticated, None otherwise
        """
        # Get user by email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            logger.warning("login_attempt_user_not_found", email=email)
            return None

        # Verify password
        if not verify_password(password, user.password_hash):
            logger.warning("login_attempt_invalid_password", email=email, user_id=str(user.id))
            return None

        logger.info("user_authenticated", user_id=str(user.id), email=email)
        return user

    @staticmethod
    def generate_tokens(user: User) -> dict:
        """
        Generate access and refresh tokens for a user.

        Args:
            user: User object

        Returns:
            dict: Dictionary with access_token and refresh_token
        """
        token_data = {
            "sub": str(user.id),
            "email": user.email,
        }

        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: UUID) -> Optional[User]:
        """
        Get user by ID.

        Args:
            db: Database session
            user_id: User UUID

        Returns:
            Optional[User]: User object if found, None otherwise
        """
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """
        Get user by email.

        Args:
            db: Database session
            email: User email

        Returns:
            Optional[User]: User object if found, None otherwise
        """
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()


# Singleton instance
better_auth = BetterAuthService()
