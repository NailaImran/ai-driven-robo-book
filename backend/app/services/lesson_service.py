"""Lesson management service."""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Lesson, UserProgress
from app.utils.markdown_parser import parse_lesson_markdown


async def get_lesson_with_progress(
    db: AsyncSession,
    lesson_id: str,
    user_id: Optional[str] = None,
) -> dict:
    """
    Get lesson content with user progress if available.

    Args:
        db: Database session
        lesson_id: Lesson ID to fetch
        user_id: Optional user ID to get progress

    Returns:
        Dictionary with lesson metadata and user progress
    """
    # Fetch lesson from database
    stmt = select(Lesson).where(Lesson.id == lesson_id)
    result = await db.execute(stmt)
    lesson = result.scalars().first()

    if not lesson:
        raise ValueError(f"Lesson not found: {lesson_id}")

    # Fetch user progress if user_id provided
    user_progress = None
    if user_id:
        stmt = select(UserProgress).where(
            (UserProgress.user_id == user_id) & (UserProgress.lesson_id == lesson_id)
        )
        result = await db.execute(stmt)
        progress = result.scalars().first()

        if progress:
            user_progress = {
                "status": progress.status,
                "completion_percentage": progress.completion_percentage,
                "time_spent_seconds": progress.time_spent_seconds,
                "quiz_score": float(progress.quiz_score) if progress.quiz_score else None,
                "quiz_attempts": progress.quiz_attempts,
                "started_at": progress.started_at.isoformat() if progress.started_at else None,
                "completed_at": progress.completed_at.isoformat() if progress.completed_at else None,
                "last_accessed_at": progress.last_accessed_at.isoformat() if progress.last_accessed_at else None,
            }

    return {
        "lesson": {
            "id": lesson.id,
            "chapter_id": lesson.chapter_id,
            "lesson_number": lesson.lesson_number,
            "title": lesson.title,
            "description": lesson.description,
            "difficulty": lesson.difficulty,
            "estimated_duration": lesson.estimated_duration,
            "keywords": lesson.keywords,
            "prerequisites": lesson.prerequisites,
            "has_quiz": lesson.has_quiz,
            "has_exercises": lesson.has_exercises,
        },
        "user_progress": user_progress,
        "content_markdown": lesson.content_markdown,
    }


async def get_chapter_lessons(
    db: AsyncSession,
    chapter_id: str,
    user_id: Optional[str] = None,
) -> list:
    """
    Get all lessons for a chapter with user progress.

    Args:
        db: Database session
        chapter_id: Chapter ID
        user_id: Optional user ID for progress

    Returns:
        List of lesson data with progress
    """
    # Fetch all lessons for chapter
    stmt = select(Lesson).where(Lesson.chapter_id == chapter_id).order_by(Lesson.lesson_number)
    result = await db.execute(stmt)
    lessons = result.scalars().all()

    if not lessons:
        return []

    # Build response for each lesson
    response = []
    for lesson in lessons:
        lesson_data = {
            "id": lesson.id,
            "chapter_id": lesson.chapter_id,
            "lesson_number": lesson.lesson_number,
            "title": lesson.title,
            "description": lesson.description,
            "difficulty": lesson.difficulty,
            "estimated_duration": lesson.estimated_duration,
            "keywords": lesson.keywords,
            "prerequisites": lesson.prerequisites,
            "has_quiz": lesson.has_quiz,
            "has_exercises": lesson.has_exercises,
        }

        # Add progress if user_id provided
        if user_id:
            stmt = select(UserProgress).where(
                (UserProgress.user_id == user_id) & (UserProgress.lesson_id == lesson.id)
            )
            result = await db.execute(stmt)
            progress = result.scalars().first()

            if progress:
                lesson_data["user_progress"] = {
                    "status": progress.status,
                    "completion_percentage": progress.completion_percentage,
                    "time_spent_seconds": progress.time_spent_seconds,
                }

        response.append(lesson_data)

    return response


async def update_lesson_progress(
    db: AsyncSession,
    user_id: str,
    lesson_id: str,
    time_spent_seconds: int,
    status: str = "in_progress",
) -> dict:
    """
    Update user progress for a lesson.

    Args:
        db: Database session
        user_id: User ID
        lesson_id: Lesson ID
        time_spent_seconds: Time spent on lesson
        status: Progress status (not_started, in_progress, completed)

    Returns:
        Updated progress data
    """
    from datetime import datetime

    # Get or create progress record
    stmt = select(UserProgress).where(
        (UserProgress.user_id == user_id) & (UserProgress.lesson_id == lesson_id)
    )
    result = await db.execute(stmt)
    progress = result.scalars().first()

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            status=status,
            time_spent_seconds=time_spent_seconds,
            started_at=datetime.utcnow(),
        )
        db.add(progress)
    else:
        progress.time_spent_seconds += time_spent_seconds
        progress.status = status
        progress.last_accessed_at = datetime.utcnow()

        if status == "completed" and not progress.completed_at:
            progress.completed_at = datetime.utcnow()
            progress.completion_percentage = 100

    await db.commit()
    await db.refresh(progress)

    return {
        "status": progress.status,
        "completion_percentage": progress.completion_percentage,
        "time_spent_seconds": progress.time_spent_seconds,
        "last_accessed_at": progress.last_accessed_at.isoformat(),
    }
