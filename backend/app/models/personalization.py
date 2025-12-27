"""User personalization preferences model."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class PersonaEnum(str, enum.Enum):
    """User persona types."""
    STUDENT = "student"
    EDUCATOR = "educator"
    SELF_LEARNER = "self_learner"
    INDUSTRY_PROFESSIONAL = "industry_professional"


class SkillLevelEnum(str, enum.Enum):
    """User skill level."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LearningPaceEnum(str, enum.Enum):
    """Learning pace preference."""
    ACCELERATED = "accelerated"
    STANDARD = "standard"
    EXTENDED = "extended"


class SoftwareBackgroundEnum(str, enum.Enum):
    """Software development background."""
    NONE = "none"
    BASIC_PYTHON = "basic_python"
    EXPERIENCED_ROS = "experienced_ros"
    PROFESSIONAL = "professional"


class HardwareBackgroundEnum(str, enum.Enum):
    """Hardware/robotics background."""
    SIMULATION_ONLY = "simulation_only"
    JETSON_KIT = "jetson_kit"
    ROBOT_LAB = "robot_lab"
    NO_HARDWARE = "no_hardware"


class LearningGoalEnum(str, enum.Enum):
    """Primary learning goal."""
    ACADEMIC_COURSE = "academic_course"
    SELF_STUDY = "self_study"
    PROFESSIONAL_UPSKILLING = "professional_upskilling"


class UserPreference(Base):
    """User personalization preferences for adaptive content delivery."""

    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Personalization attributes
    persona = Column(SQLEnum(PersonaEnum), nullable=True)
    skill_level = Column(SQLEnum(SkillLevelEnum), nullable=True)
    learning_pace = Column(SQLEnum(LearningPaceEnum), nullable=True)
    language_preference = Column(String(5), default="en", nullable=False)

    # Background questions (from signup)
    software_background = Column(SQLEnum(SoftwareBackgroundEnum), nullable=True)
    hardware_background = Column(SQLEnum(HardwareBackgroundEnum), nullable=True)
    learning_goal = Column(SQLEnum(LearningGoalEnum), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="preference")

    def __repr__(self) -> str:
        return f"<UserPreference(user_id={self.user_id}, persona={self.persona}, skill_level={self.skill_level})>"
