"""Pydantic schemas for personalization."""

from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

from app.models.personalization import (
    PersonaEnum,
    SkillLevelEnum,
    LearningPaceEnum,
    SoftwareBackgroundEnum,
    HardwareBackgroundEnum,
    LearningGoalEnum,
)


class PersonalizationProfileResponse(BaseModel):
    """Response schema for user personalization profile."""
    id: UUID
    user_id: UUID
    persona: Optional[PersonaEnum]
    skill_level: Optional[SkillLevelEnum]
    learning_pace: Optional[LearningPaceEnum]
    language_preference: str
    software_background: Optional[SoftwareBackgroundEnum]
    hardware_background: Optional[HardwareBackgroundEnum]
    learning_goal: Optional[LearningGoalEnum]
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174001",
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "persona": "student",
                "skill_level": "beginner",
                "learning_pace": "standard",
                "language_preference": "en",
                "software_background": "basic_python",
                "hardware_background": "no_hardware",
                "learning_goal": "academic_course",
                "created_at": "2025-12-13T00:00:00Z",
                "updated_at": "2025-12-13T00:00:00Z"
            }
        }
    }


class UpdatePersonalizationRequest(BaseModel):
    """Request schema for updating personalization preferences."""
    persona: Optional[PersonaEnum] = None
    skill_level: Optional[SkillLevelEnum] = None
    learning_pace: Optional[LearningPaceEnum] = None
    language_preference: Optional[str] = Field(None, pattern="^(en|ur)$")
    software_background: Optional[SoftwareBackgroundEnum] = None
    hardware_background: Optional[HardwareBackgroundEnum] = None
    learning_goal: Optional[LearningGoalEnum] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "persona": "professional",
                "skill_level": "intermediate",
                "learning_pace": "accelerated",
                "language_preference": "en"
            }
        }
    }


class LocalStorageSyncRequest(BaseModel):
    """Request schema for syncing localStorage preferences to backend on login."""
    persona: Optional[PersonaEnum] = None
    skill_level: Optional[SkillLevelEnum] = None
    learning_pace: Optional[LearningPaceEnum] = None
    language_preference: Optional[str] = "en"

    model_config = {
        "json_schema_extra": {
            "example": {
                "persona": "student",
                "skill_level": "beginner",
                "learning_pace": "standard",
                "language_preference": "en"
            }
        }
    }
