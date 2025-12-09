"""Quiz routes."""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from decimal import Decimal

from app.database import get_db
from app.models import User, Quiz, QuizAttempt
from app.schemas.quiz import QuizResponse, QuizAnswerSubmit, QuizSubmitResponse, QuizHistoryResponse
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/{chapter_id}", response_model=QuizResponse)
async def get_quiz(
    chapter_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get quiz questions for a chapter.

    Args:
        chapter_id: Chapter ID
        current_user: Current authenticated user
        db: Database session

    Returns:
        Quiz with questions

    Raises:
        HTTPException: If quiz not found
    """
    stmt = select(Quiz).where(Quiz.chapter_id == chapter_id)
    result = await db.execute(stmt)
    quiz = result.scalars().first()

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quiz not found for chapter {chapter_id}",
        )

    # Parse questions from JSON
    questions = quiz.questions if isinstance(quiz.questions, list) else []

    return {
        "id": str(quiz.id),
        "chapter_id": quiz.chapter_id,
        "title": quiz.title,
        "total_questions": len(questions),
        "passing_score": float(quiz.passing_score),
        "questions": questions,
    }


@router.post("/{quiz_id}/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    quiz_id: str,
    answers: QuizAnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit quiz answers and get score.

    Args:
        quiz_id: Quiz ID
        answers: User's answers
        current_user: Current authenticated user
        db: Database session

    Returns:
        QuizSubmitResponse with score and feedback

    Raises:
        HTTPException: If quiz not found
    """
    stmt = select(Quiz).where(Quiz.id == UUID(quiz_id))
    result = await db.execute(stmt)
    quiz = result.scalars().first()

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )

    # Get questions
    questions = quiz.questions if isinstance(quiz.questions, list) else []

    # Grade answers
    correct_count = 0
    weak_topics = []

    for question in questions:
        question_num = str(question.get("question_number"))
        user_answer = answers.answers.get(question_num, "")
        correct_answer = question.get("correct_answer", "")

        if user_answer.upper() == correct_answer.upper():
            correct_count += 1
        else:
            # Track weak topics
            if "keywords" in question:
                weak_topics.extend(question["keywords"])

    # Calculate score
    total_questions = len(questions)
    score = (correct_count / total_questions * 100) if total_questions > 0 else 0
    passed = score >= float(quiz.passing_score)

    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=UUID(quiz_id),
        score=Decimal(str(score)),
        passed=passed,
        answers=answers.answers,
        correct_count=correct_count,
        total_questions=total_questions,
    )
    db.add(attempt)
    await db.commit()

    # Remove duplicates from weak topics
    weak_topics = list(set(weak_topics))[:5]  # Top 5 unique weak topics

    return {
        "score": score,
        "passed": passed,
        "correct_answers": correct_count,
        "total_questions": total_questions,
        "weak_topics": weak_topics,
    }


@router.get("/scores")
async def get_quiz_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get user's quiz attempt history.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        QuizHistoryResponse with all attempts and statistics
    """
    stmt = select(QuizAttempt).where(QuizAttempt.user_id == current_user.id).order_by(QuizAttempt.created_at.desc())
    result = await db.execute(stmt)
    attempts = result.scalars().all()

    if not attempts:
        return {
            "total_attempts": 0,
            "average_score": 0.0,
            "history": [],
        }

    # Calculate statistics
    total_attempts = len(attempts)
    average_score = sum(float(a.score) for a in attempts) / total_attempts if attempts else 0

    # Build history
    history = []
    for attempt in attempts:
        # Get quiz info
        stmt = select(Quiz).where(Quiz.id == attempt.quiz_id)
        result = await db.execute(stmt)
        quiz = result.scalars().first()

        if quiz:
            history.append(
                {
                    "quiz_id": str(attempt.quiz_id),
                    "chapter_id": quiz.chapter_id,
                    "score": float(attempt.score),
                    "passed": attempt.passed,
                    "attempted_at": attempt.created_at.isoformat(),
                }
            )

    return {
        "total_attempts": total_attempts,
        "average_score": round(average_score, 2),
        "history": history,
    }
