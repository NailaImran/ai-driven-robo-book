"""Lesson model."""

from sqlalchemy import Column, String, Integer, DateTime, Boolean, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class Lesson(Base):
    """Lesson content model."""

    __tablename__ = "lessons"

    id = Column(String(100), primary_key=True)  # e.g., "chapter-1-lesson-1"
    chapter_id = Column(String(50), nullable=False, index=True)
    lesson_number = Column(Integer, nullable=False)

    title = Column(String(255), nullable=False)
    title_ur = Column(String(255))
    description = Column(Text, nullable=False)
    description_ur = Column(Text)

    content_path = Column(String(500), nullable=False)
    content_text = Column(Text)
    content_markdown = Column(Text)

    keywords = Column(JSON, default=list, nullable=False)
    prerequisites = Column(JSON, default=list, nullable=False)

    difficulty = Column(String(20), nullable=False, index=True)  # Beginner, Intermediate, Advanced
    estimated_duration = Column(Integer, nullable=False)  # in minutes

    has_quiz = Column(Boolean, default=False, nullable=False)
    has_exercises = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<Lesson(id={self.id}, title={self.title}, difficulty={self.difficulty})>"
