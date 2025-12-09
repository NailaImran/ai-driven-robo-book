"""Quiz models."""

from sqlalchemy import Column, String, DateTime, Boolean, JSON, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class Quiz(Base):
    """Quiz model."""

    __tablename__ = "quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chapter_id = Column(String(50), nullable=False, index=True)
    lesson_id = Column(String(100), nullable=True, index=True)

    title = Column(String(255), nullable=False)
    questions = Column(JSON, nullable=False)  # List of question objects

    passing_score = Column(DECIMAL(5, 2), default=70.00, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Quiz(id={self.id}, chapter={self.chapter_id}, title={self.title})>"


class QuizAttempt(Base):
    """User quiz attempt record."""

    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    quiz_id = Column(UUID(as_uuid=True), nullable=False, index=True)

    score = Column(DECIMAL(5, 2), nullable=False)
    passed = Column(Boolean, nullable=False)
    answers = Column(JSON, nullable=False)  # User's answers

    correct_count = Column(Integer, default=0, nullable=False)
    total_questions = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<QuizAttempt(user={self.user_id}, quiz={self.quiz_id}, score={self.score})>"
