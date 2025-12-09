"""Lesson routes."""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.schemas.lesson import LessonResponse, LessonListResponse
from app.services.lesson_service import (
    get_lesson_with_progress,
    get_chapter_lessons,
    update_lesson_progress,
)
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get lesson content with user progress.

    Args:
        lesson_id: Lesson ID (e.g., 'chapter-1-lesson-1')
        current_user: Current authenticated user
        db: Database session

    Returns:
        LessonResponse with content and progress

    Raises:
        HTTPException: If lesson not found
    """
    try:
        lesson_data = await get_lesson_with_progress(
            db=db,
            lesson_id=lesson_id,
            user_id=str(current_user.id),
        )
        return lesson_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("")
async def list_lessons(
    chapter_id: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List all lessons or lessons for a specific chapter.

    Args:
        chapter_id: Optional chapter ID to filter by
        current_user: Current authenticated user
        db: Database session

    Returns:
        LessonListResponse with lessons and metadata
    """
    if not chapter_id:
        # Return all lessons
        from sqlalchemy import select
        from app.models import Lesson

        stmt = select(Lesson).order_by(Lesson.chapter_id, Lesson.lesson_number)
        result = await db.execute(stmt)
        lessons = result.scalars().all()

        lessons_data = [
            {
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
            for lesson in lessons
        ]

        return {
            "total": len(lessons_data),
            "lessons": lessons_data,
        }
    else:
        # Return lessons for chapter
        lessons_data = await get_chapter_lessons(
            db=db,
            chapter_id=chapter_id,
            user_id=str(current_user.id),
        )

        return {
            "total": len(lessons_data),
            "lessons": lessons_data,
        }


@router.post("/{lesson_id}/complete")
async def mark_lesson_complete(
    lesson_id: str,
    time_spent_seconds: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark a lesson as completed.

    Args:
        lesson_id: Lesson ID
        time_spent_seconds: Time spent on lesson
        current_user: Current authenticated user
        db: Database session

    Returns:
        Updated progress data

    Raises:
        HTTPException: If lesson not found or error updating
    """
    try:
        progress = await update_lesson_progress(
            db=db,
            user_id=str(current_user.id),
            lesson_id=lesson_id,
            time_spent_seconds=time_spent_seconds,
            status="completed",
        )
        return {
            "message": "Lesson marked as completed",
            "progress": progress,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post("/{lesson_id}/update-progress")
async def update_progress(
    lesson_id: str,
    time_spent_seconds: int = 0,
    status: str = "in_progress",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update progress for a lesson.

    Args:
        lesson_id: Lesson ID
        time_spent_seconds: Time spent on lesson
        status: Progress status (not_started, in_progress, completed)
        current_user: Current authenticated user
        db: Database session

    Returns:
        Updated progress data
    """
    try:
        progress = await update_lesson_progress(
            db=db,
            user_id=str(current_user.id),
            lesson_id=lesson_id,
            time_spent_seconds=time_spent_seconds,
            status=status,
        )
        return {
            "message": "Progress updated",
            "progress": progress,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
