"""Pydantic schemas for authentication."""

from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

from app.models.personalization import (
    PersonaEnum,
    SkillLevelEnum,
    LearningPaceEnum,
    SoftwareBackgroundEnum,
    HardwareBackgroundEnum,
    LearningGoalEnum,
)


class SignupRequest(BaseModel):
    """Request schema for user signup."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)

    # Personalization (collected during signup)
    persona: Optional[PersonaEnum] = None
    skill_level: Optional[SkillLevelEnum] = None
    learning_pace: Optional[LearningPaceEnum] = None
    software_background: Optional[SoftwareBackgroundEnum] = None
    hardware_background: Optional[HardwareBackgroundEnum] = None
    learning_goal: Optional[LearningGoalEnum] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "student@example.com",
                "password": "SecurePassword123!",
                "full_name": "Jane Doe",
                "persona": "student",
                "skill_level": "beginner",
                "learning_pace": "standard",
                "software_background": "basic_python",
                "hardware_background": "no_hardware",
                "learning_goal": "academic_course"
            }
        }
    }


class SigninRequest(BaseModel):
    """Request schema for user signin."""
    email: EmailStr
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "student@example.com",
                "password": "SecurePassword123!"
            }
        }
    }


class UserResponse(BaseModel):
    """Response schema for user data."""
    id: UUID
    email: str
    full_name: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "student@example.com",
                "full_name": "Jane Doe",
                "created_at": "2025-12-13T00:00:00Z"
            }
        }
    }


class TokenResponse(BaseModel):
    """Response schema for authentication token."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400  # 24 hours
    user: UserResponse


class SessionResponse(BaseModel):
    """Response schema for session check."""
    authenticated: bool
    user: Optional[UserResponse] = None
