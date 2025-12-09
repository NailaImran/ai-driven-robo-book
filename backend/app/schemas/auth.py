"""Authentication schemas."""

from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserBackgroundCreate(BaseModel):
    """User background questionnaire schema."""

    python_experience: int = 1  # 1-5 scale
    cpp_experience: int = 1
    ros_experience: int = 1
    robotics_experience: int = 1
    software_projects_count: int = 0
    hardware_projects_count: int = 0
    hardware_platforms: List[str] = []
    current_role: str = "Student"
    preferred_language: str = "Python"
    learning_pace: str = "Moderate"
    learning_goals: List[str] = []

    class Config:
        json_schema_extra = {
            "example": {
                "python_experience": 2,
                "cpp_experience": 1,
                "ros_experience": 1,
                "robotics_experience": 2,
                "software_projects_count": 3,
                "hardware_projects_count": 1,
                "hardware_platforms": ["Arduino", "Raspberry Pi"],
                "current_role": "Student",
                "preferred_language": "Python",
                "learning_pace": "Moderate",
                "learning_goals": ["Learn ROS2", "Build a robot arm"],
            }
        }


class SignupRequest(BaseModel):
    """Signup request schema."""

    email: EmailStr
    password: str
    name: str
    background: UserBackgroundCreate

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123",
                "name": "John Doe",
                "background": {
                    "python_experience": 2,
                    "cpp_experience": 1,
                    "ros_experience": 1,
                    "robotics_experience": 2,
                    "learning_goals": ["Learn ROS2"],
                },
            }
        }


class SigninRequest(BaseModel):
    """Signin request schema."""

    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123",
            }
        }


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str
    token_type: str = "bearer"

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
            }
        }


class UserResponse(BaseModel):
    """User response schema."""

    id: str
    email: str
    name: str
    expertise_level: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "name": "John Doe",
                "expertise_level": "Beginner",
            }
        }


class AuthResponse(BaseModel):
    """Authentication response schema."""

    access_token: str
    token_type: str
    user: UserResponse

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "email": "user@example.com",
                    "name": "John Doe",
                    "expertise_level": "Beginner",
                },
            }
        }


class SessionResponse(BaseModel):
    """Session validation response."""

    user: Optional[UserResponse] = None
    authenticated: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "user": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "email": "user@example.com",
                    "name": "John Doe",
                    "expertise_level": "Beginner",
                },
                "authenticated": True,
            }
        }
