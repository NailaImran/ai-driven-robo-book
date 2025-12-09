"""User models."""

from sqlalchemy import Boolean, Column, DateTime, String, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"


class UserBackground(Base):
    """User technical background and preferences."""

    __tablename__ = "user_backgrounds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        nullable=False,
        unique=True,
        index=True,
    )

    # Software Experience (1-5 scale)
    python_experience = Column(Integer, default=1, nullable=False)  # 1=None, 5=Expert
    cpp_experience = Column(Integer, default=1, nullable=False)
    ros_experience = Column(Integer, default=1, nullable=False)
    software_projects_count = Column(Integer, default=0, nullable=False)

    # Hardware & Robotics Experience
    robotics_experience = Column(Integer, default=1, nullable=False)
    hardware_projects_count = Column(Integer, default=0, nullable=False)
    hardware_platforms = Column(JSON, default=list, nullable=False)  # ["Arduino", "Raspberry Pi"]

    # Learning Preferences
    current_role = Column(String(50), default="Student", nullable=False)
    preferred_language = Column(String(10), default="Python", nullable=False)
    learning_pace = Column(String(20), default="Moderate", nullable=False)
    learning_goals = Column(JSON, default=list, nullable=False)

    # Computed Expertise Level (Beginner, Intermediate, Advanced)
    expertise_level = Column(String(20), default="Beginner", nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<UserBackground(user_id={self.user_id}, expertise={self.expertise_level})>"


class UserPreference(Base):
    """User display and content preferences."""

    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        nullable=False,
        unique=True,
        index=True,
    )

    # Language preference
    language = Column(String(10), default="en", nullable=False)  # 'en' or 'ur'

    # Content display preferences
    show_detailed_explanations = Column(Boolean, default=True, nullable=False)
    show_advanced_content = Column(Boolean, default=False, nullable=False)
    hide_setup_instructions = Column(Boolean, default=False, nullable=False)
    show_research_papers = Column(Boolean, default=False, nullable=False)

    # Theme preference
    dark_mode = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<UserPreference(user_id={self.user_id}, language={self.language})>"
