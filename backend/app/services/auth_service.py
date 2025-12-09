"""Authentication service."""

from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from uuid import UUID

from app.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Create JWT access token.

    Args:
        data: Payload data to encode (should include 'sub' for user_id)
        expires_delta: Token expiration time delta

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            hours=settings.ACCESS_TOKEN_EXPIRE_HOURS
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return encoded_jwt


def compute_expertise_level(background_data: dict) -> str:
    """
    Compute expertise level from user background.

    Args:
        background_data: User background information with experience scores

    Returns:
        Expertise level: 'Beginner', 'Intermediate', or 'Advanced'
    """
    # Calculate average of technical experience
    experiences = [
        background_data.get("python_experience", 1),
        background_data.get("cpp_experience", 1),
        background_data.get("ros_experience", 1),
        background_data.get("robotics_experience", 1),
    ]

    avg_experience = sum(experiences) / len(experiences)
    projects = (
        background_data.get("software_projects_count", 0)
        + background_data.get("hardware_projects_count", 0)
    )

    # Determine expertise level
    if avg_experience >= 4 or projects >= 5:
        return "Advanced"
    elif avg_experience >= 2.5 or projects >= 2:
        return "Intermediate"
    else:
        return "Beginner"
