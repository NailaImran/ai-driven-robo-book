"""User progress tracking model."""

from sqlalchemy import Column, String, Integer, DateTime, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class UserProgress(Base):
    """User progress tracking per lesson."""

    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    lesson_id = Column(String(100), nullable=False, index=True)

    # Status: not_started, in_progress, completed
    status = Column(String(20), default="not_started", nullable=False, index=True)

    completion_percentage = Column(Integer, default=0, nullable=False)
    time_spent_seconds = Column(Integer, default=0, nullable=False)

    # Quiz score if applicable
    quiz_score = Column(DECIMAL(5, 2), nullable=True)
    quiz_attempts = Column(Integer, default=0, nullable=False)

    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    __table_args__ = (
        {"schema": None},  # UniqueConstraint will be added in migration if needed
    )

    def __repr__(self):
        return f"<UserProgress(user={self.user_id}, lesson={self.lesson_id}, status={self.status})>"
