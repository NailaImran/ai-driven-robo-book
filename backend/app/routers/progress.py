"""User progress routes."""

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, UserProgress, Lesson
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/summary")
async def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get user's overall progress summary.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        Progress summary with statistics
    """
    # Get all lessons
    stmt = select(func.count(Lesson.id))
    result = await db.execute(stmt)
    total_lessons = result.scalar() or 0

    # Get user progress
    stmt = select(UserProgress).where(UserProgress.user_id == current_user.id)
    result = await db.execute(stmt)
    progress_records = result.scalars().all()

    # Calculate statistics
    completed_lessons = sum(1 for p in progress_records if p.status == "completed")
    total_time_seconds = sum(p.time_spent_seconds for p in progress_records)
    total_time_hours = total_time_seconds / 3600

    # Calculate quiz average
    quiz_scores = [float(p.quiz_score) for p in progress_records if p.quiz_score]
    quiz_average = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0

    # Group by chapter
    chapters_progress = {}
    for progress in progress_records:
        chapter_id = progress.lesson_id.split("-lesson-")[0] if "-lesson-" in progress.lesson_id else "unknown"

        if chapter_id not in chapters_progress:
            chapters_progress[chapter_id] = {
                "completed": 0,
                "total": 0,
                "statuses": [],
            }

        chapters_progress[chapter_id]["total"] += 1
        if progress.status == "completed":
            chapters_progress[chapter_id]["completed"] += 1
        chapters_progress[chapter_id]["statuses"].append(progress.status)

    # Build chapter progress list
    chapters = []
    for chapter_id, data in chapters_progress.items():
        chapters.append(
            {
                "chapter_id": chapter_id,
                "completed": data["completed"],
                "total": data["total"],
                "status": "completed" if data["completed"] == data["total"] else "in_progress",
            }
        )

    completion_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0

    return {
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "completion_percentage": round(completion_percentage, 2),
        "total_time_hours": round(total_time_hours, 2),
        "quiz_average": round(quiz_average, 2),
        "chapters": sorted(chapters, key=lambda x: x["chapter_id"]),
    }


@router.get("/weak-areas")
async def get_weak_areas(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Identify user's weak areas based on quiz performance.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        List of topics/lessons where user scored low
    """
    from sqlalchemy import and_

    # Get quiz attempts with low scores
    stmt = select(UserProgress).where(
        and_(
            UserProgress.user_id == current_user.id,
            UserProgress.quiz_score < 70,  # Low score threshold
        )
    )
    result = await db.execute(stmt)
    weak_progress = result.scalars().all()

    weak_areas = []
    for progress in weak_progress:
        # Get lesson to get keywords
        stmt = select(Lesson).where(Lesson.id == progress.lesson_id)
        result = await db.execute(stmt)
        lesson = result.scalars().first()

        if lesson:
            weak_areas.append(
                {
                    "lesson_id": lesson.id,
                    "title": lesson.title,
                    "score": float(progress.quiz_score) if progress.quiz_score else None,
                    "keywords": lesson.keywords,
                    "difficulty": lesson.difficulty,
                }
            )

    # Sort by score (lowest first)
    weak_areas = sorted(weak_areas, key=lambda x: x["score"] if x["score"] else 0)

    return {
        "total_weak_areas": len(weak_areas),
        "weak_areas": weak_areas[:10],  # Top 10 weak areas
    }


@router.get("/lessons/{lesson_id}")
async def get_lesson_progress(
    lesson_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get detailed progress for a specific lesson.

    Args:
        lesson_id: Lesson ID
        current_user: Current authenticated user
        db: Database session

    Returns:
        Lesson progress details
    """
    stmt = select(UserProgress).where(
        (UserProgress.user_id == current_user.id) & (UserProgress.lesson_id == lesson_id)
    )
    result = await db.execute(stmt)
    progress = result.scalars().first()

    if not progress:
        return {
            "lesson_id": lesson_id,
            "status": "not_started",
            "completion_percentage": 0,
            "time_spent_seconds": 0,
            "quiz_score": None,
            "quiz_attempts": 0,
        }

    return {
        "lesson_id": lesson_id,
        "status": progress.status,
        "completion_percentage": progress.completion_percentage,
        "time_spent_seconds": progress.time_spent_seconds,
        "quiz_score": float(progress.quiz_score) if progress.quiz_score else None,
        "quiz_attempts": progress.quiz_attempts,
        "started_at": progress.started_at.isoformat() if progress.started_at else None,
        "completed_at": progress.completed_at.isoformat() if progress.completed_at else None,
        "last_accessed_at": progress.last_accessed_at.isoformat() if progress.last_accessed_at else None,
    }
