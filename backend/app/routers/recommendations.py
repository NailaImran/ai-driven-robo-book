"""Lesson recommendations routes."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, UserProgress, Lesson, UserBackground
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/next-lesson")
async def get_next_lesson_recommendation(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get personalized next lesson recommendation.

    Strategy:
    1. Get user's weak areas (low quiz scores)
    2. Get user's expertise level
    3. Find next incomplete lesson matching expertise level
    4. Prioritize lessons related to weak areas

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        Recommended lesson(s)
    """
    # Get user background for expertise level
    stmt = select(UserBackground).where(UserBackground.user_id == current_user.id)
    result = await db.execute(stmt)
    background = result.scalars().first()

    expertise_level = background.expertise_level if background else "Beginner"

    # Get user's completed lessons
    stmt = select(UserProgress).where(
        (UserProgress.user_id == current_user.id) & (UserProgress.status == "completed")
    )
    result = await db.execute(stmt)
    completed_progress = result.scalars().all()
    completed_lesson_ids = {p.lesson_id for p in completed_progress}

    # Get weak areas (low quiz scores)
    stmt = select(UserProgress).where(
        (UserProgress.user_id == current_user.id) & (UserProgress.quiz_score < 70)
    )
    result = await db.execute(stmt)
    weak_progress = result.scalars().all()

    weak_keywords = []
    for progress in weak_progress:
        stmt = select(Lesson).where(Lesson.id == progress.lesson_id)
        result = await db.execute(stmt)
        lesson = result.scalars().first()
        if lesson and lesson.keywords:
            weak_keywords.extend(lesson.keywords)

    # Get next lessons (not completed, matching expertise)
    difficulty_map = {"Beginner": ["Beginner"], "Intermediate": ["Beginner", "Intermediate"], "Advanced": ["Beginner", "Intermediate", "Advanced"]}
    allowed_difficulties = difficulty_map.get(expertise_level, ["Beginner"])

    stmt = select(Lesson).where(Lesson.difficulty.in_(allowed_difficulties)).order_by(Lesson.chapter_id, Lesson.lesson_number)
    result = await db.execute(stmt)
    available_lessons = result.scalars().all()

    # Filter incomplete lessons
    incomplete_lessons = [l for l in available_lessons if l.id not in completed_lesson_ids]

    if not incomplete_lessons:
        return {
            "message": "All lessons completed!",
            "recommendations": [],
        }

    # Score lessons based on weak areas
    recommendations = []
    for lesson in incomplete_lessons[:5]:  # Top 5 recommendations
        relevance_score = 0

        # Check if lesson covers weak areas
        if lesson.keywords:
            for keyword in lesson.keywords:
                if keyword in weak_keywords:
                    relevance_score += 1

        recommendations.append(
            {
                "lesson_id": lesson.id,
                "title": lesson.title,
                "chapter_id": lesson.chapter_id,
                "difficulty": lesson.difficulty,
                "estimated_duration": lesson.estimated_duration,
                "reason": f"Helps with weak areas in {', '.join(lesson.keywords[:3])}" if relevance_score > 0 else "Next recommended lesson",
                "relevance_score": relevance_score,
            }
        )

    # Sort by relevance
    recommendations = sorted(recommendations, key=lambda x: x["relevance_score"], reverse=True)

    return {
        "recommendations": recommendations,
        "user_expertise": expertise_level,
        "total_available": len(incomplete_lessons),
    }


@router.get("/by-keywords/{keywords}")
async def get_recommendations_by_keywords(
    keywords: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get lessons matching specific keywords.

    Args:
        keywords: Comma-separated keywords
        current_user: Current authenticated user
        db: Database session

    Returns:
        Lessons matching keywords
    """
    keyword_list = [k.strip().lower() for k in keywords.split(",")]

    # Get all lessons
    stmt = select(Lesson).order_by(Lesson.chapter_id, Lesson.lesson_number)
    result = await db.execute(stmt)
    all_lessons = result.scalars().all()

    # Filter by keywords
    matching_lessons = []
    for lesson in all_lessons:
        lesson_keywords_lower = [k.lower() for k in (lesson.keywords or [])]

        # Check if any keyword matches
        if any(kw in lesson_keywords_lower for kw in keyword_list):
            matching_lessons.append(
                {
                    "lesson_id": lesson.id,
                    "title": lesson.title,
                    "chapter_id": lesson.chapter_id,
                    "difficulty": lesson.difficulty,
                    "estimated_duration": lesson.estimated_duration,
                    "keywords": lesson.keywords,
                    "description": lesson.description,
                }
            )

    return {
        "keywords": keyword_list,
        "total_matches": len(matching_lessons),
        "lessons": matching_lessons,
    }


@router.get("/difficulty/{difficulty}")
async def get_lessons_by_difficulty(
    difficulty: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all lessons at a specific difficulty level.

    Args:
        difficulty: Difficulty level (Beginner, Intermediate, Advanced)
        current_user: Current authenticated user
        db: Database session

    Returns:
        Lessons at specified difficulty
    """
    stmt = select(Lesson).where(Lesson.difficulty == difficulty).order_by(Lesson.chapter_id, Lesson.lesson_number)
    result = await db.execute(stmt)
    lessons = result.scalars().all()

    # Get user progress
    stmt = select(UserProgress).where(UserProgress.user_id == current_user.id)
    result = await db.execute(stmt)
    progress_records = result.scalars().all()
    progress_map = {p.lesson_id: p.status for p in progress_records}

    lessons_data = [
        {
            "lesson_id": lesson.id,
            "title": lesson.title,
            "chapter_id": lesson.chapter_id,
            "difficulty": lesson.difficulty,
            "estimated_duration": lesson.estimated_duration,
            "keywords": lesson.keywords,
            "user_progress": progress_map.get(lesson.id, "not_started"),
        }
        for lesson in lessons
    ]

    return {
        "difficulty": difficulty,
        "total_lessons": len(lessons_data),
        "lessons": lessons_data,
    }
