"""Quiz schemas."""

from pydantic import BaseModel
from typing import List, Optional


class QuizQuestion(BaseModel):
    """Quiz question schema."""

    question_number: int
    question_text: str
    options: List[str]
    correct_answer: str  # A, B, C, D
    explanation: str

    class Config:
        json_schema_extra = {
            "example": {
                "question_number": 1,
                "question_text": "What is Physical AI?",
                "options": [
                    "AI that learns from physical interactions",
                    "Traditional AI in physical form",
                    "AI without physics simulation",
                    "AI for mechanical engineering",
                ],
                "correct_answer": "A",
                "explanation": "Physical AI learns from interaction with the physical world...",
            }
        }


class QuizResponse(BaseModel):
    """Quiz with questions response."""

    id: str
    chapter_id: str
    title: str
    total_questions: int
    passing_score: float
    questions: List[QuizQuestion]

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "chapter_id": "chapter-1",
                "title": "Chapter 1 Quiz",
                "total_questions": 20,
                "passing_score": 70.0,
                "questions": [
                    {
                        "question_number": 1,
                        "question_text": "What is Physical AI?",
                        "options": ["A", "B", "C", "D"],
                        "correct_answer": "A",
                        "explanation": "...",
                    }
                ],
            }
        }


class QuizAnswerSubmit(BaseModel):
    """User quiz answers submission."""

    answers: dict  # {question_number: answer_letter}

    class Config:
        json_schema_extra = {
            "example": {
                "answers": {
                    "1": "A",
                    "2": "B",
                    "3": "C",
                }
            }
        }


class QuizSubmitResponse(BaseModel):
    """Quiz submission response."""

    score: float
    passed: bool
    correct_answers: int
    total_questions: int
    weak_topics: List[str] = []

    class Config:
        json_schema_extra = {
            "example": {
                "score": 85.0,
                "passed": True,
                "correct_answers": 17,
                "total_questions": 20,
                "weak_topics": ["ROS2 nodes", "URDF syntax"],
            }
        }


class QuizHistoryItem(BaseModel):
    """Quiz attempt in history."""

    quiz_id: str
    chapter_id: str
    score: float
    passed: bool
    attempted_at: str

    class Config:
        json_schema_extra = {
            "example": {
                "quiz_id": "550e8400-e29b-41d4-a716-446655440000",
                "chapter_id": "chapter-1",
                "score": 85.0,
                "passed": True,
                "attempted_at": "2025-12-09T10:00:00Z",
            }
        }


class QuizHistoryResponse(BaseModel):
    """Quiz history response."""

    total_attempts: int
    average_score: float
    history: List[QuizHistoryItem]

    class Config:
        json_schema_extra = {
            "example": {
                "total_attempts": 5,
                "average_score": 82.0,
                "history": [
                    {
                        "quiz_id": "550e8400-e29b-41d4-a716-446655440000",
                        "chapter_id": "chapter-1",
                        "score": 85.0,
                        "passed": True,
                        "attempted_at": "2025-12-09T10:00:00Z",
                    }
                ],
            }
        }
