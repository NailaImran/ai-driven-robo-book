"""Lesson schemas."""

from pydantic import BaseModel
from typing import List, Optional


class LessonMetadata(BaseModel):
    """Lesson metadata schema."""

    id: str
    chapter_id: str
    lesson_number: int
    title: str
    description: str
    difficulty: str  # Beginner, Intermediate, Advanced
    estimated_duration: int  # minutes
    keywords: List[str]
    prerequisites: List[str]
    has_quiz: bool = False
    has_exercises: bool = False

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "chapter-1-lesson-1",
                "chapter_id": "chapter-1",
                "lesson_number": 1,
                "title": "Introduction to Physical AI",
                "description": "Learn the basics of Physical AI...",
                "difficulty": "Beginner",
                "estimated_duration": 120,
                "keywords": ["physical-ai", "robotics"],
                "prerequisites": [],
                "has_quiz": False,
                "has_exercises": True,
            }
        }


class UserProgressData(BaseModel):
    """User progress data for a lesson."""

    status: str  # not_started, in_progress, completed
    completion_percentage: int
    time_spent_seconds: int
    quiz_score: Optional[float] = None
    quiz_attempts: int = 0
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    last_accessed_at: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "status": "in_progress",
                "completion_percentage": 60,
                "time_spent_seconds": 1800,
                "quiz_score": None,
                "quiz_attempts": 0,
                "started_at": "2025-12-09T10:00:00Z",
                "completed_at": None,
                "last_accessed_at": "2025-12-09T11:30:00Z",
            }
        }


class LessonResponse(BaseModel):
    """Lesson response with content."""

    lesson: LessonMetadata
    user_progress: Optional[UserProgressData] = None
    content_markdown: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "lesson": {
                    "id": "chapter-1-lesson-1",
                    "title": "Introduction to Physical AI",
                },
                "user_progress": {
                    "status": "in_progress",
                    "completion_percentage": 60,
                },
                "content_markdown": "# Introduction to Physical AI\n\n...",
            }
        }


class LessonListResponse(BaseModel):
    """List of lessons response."""

    total: int
    lessons: List[LessonMetadata]

    class Config:
        json_schema_extra = {
            "example": {
                "total": 18,
                "lessons": [
                    {
                        "id": "chapter-1-lesson-1",
                        "title": "Introduction to Physical AI",
                    }
                ],
            }
        }
