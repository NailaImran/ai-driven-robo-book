"""User routes."""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.models import User, UserBackground, UserPreference
from app.dependencies import get_current_user

router = APIRouter()


class UserProfileResponse(BaseModel):
    """User profile response."""

    id: str
    email: str
    name: str
    expertise_level: str

    class Config:
        from_attributes = True


class UserPreferenceUpdate(BaseModel):
    """User preference update."""

    language: str = None
    show_detailed_explanations: bool = None
    show_advanced_content: bool = None
    dark_mode: bool = None


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get current user profile.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        User profile data
    """
    # Get expertise level from background
    stmt = select(UserBackground).where(UserBackground.user_id == current_user.id)
    result = await db.execute(stmt)
    background = result.scalars().first()

    expertise_level = background.expertise_level if background else "Beginner"

    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "expertise_level": expertise_level,
    }


@router.get("/me/preferences")
async def get_user_preferences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get user preferences.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        User preferences
    """
    stmt = select(UserPreference).where(UserPreference.user_id == current_user.id)
    result = await db.execute(stmt)
    preference = result.scalars().first()

    if not preference:
        # Create default preference
        preference = UserPreference(user_id=current_user.id, language="en")
        db.add(preference)
        await db.commit()

    return {
        "language": preference.language,
        "show_detailed_explanations": preference.show_detailed_explanations,
        "show_advanced_content": preference.show_advanced_content,
        "hide_setup_instructions": preference.hide_setup_instructions,
        "show_research_papers": preference.show_research_papers,
        "dark_mode": preference.dark_mode,
    }


@router.patch("/me/preferences")
async def update_user_preferences(
    preferences: UserPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update user preferences.

    Args:
        preferences: Preference updates
        current_user: Current authenticated user
        db: Database session

    Returns:
        Updated preferences
    """
    stmt = select(UserPreference).where(UserPreference.user_id == current_user.id)
    result = await db.execute(stmt)
    preference = result.scalars().first()

    if not preference:
        preference = UserPreference(user_id=current_user.id)
        db.add(preference)

    # Update fields if provided
    if preferences.language is not None:
        preference.language = preferences.language
    if preferences.show_detailed_explanations is not None:
        preference.show_detailed_explanations = preferences.show_detailed_explanations
    if preferences.show_advanced_content is not None:
        preference.show_advanced_content = preferences.show_advanced_content
    if preferences.dark_mode is not None:
        preference.dark_mode = preferences.dark_mode

    await db.commit()
    await db.refresh(preference)

    return {
        "language": preference.language,
        "show_detailed_explanations": preference.show_detailed_explanations,
        "show_advanced_content": preference.show_advanced_content,
        "hide_setup_instructions": preference.hide_setup_instructions,
        "show_research_papers": preference.show_research_papers,
        "dark_mode": preference.dark_mode,
    }


@router.get("/me/background")
async def get_user_background(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get user background information.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        User background data
    """
    stmt = select(UserBackground).where(UserBackground.user_id == current_user.id)
    result = await db.execute(stmt)
    background = result.scalars().first()

    if not background:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User background not found",
        )

    return {
        "python_experience": background.python_experience,
        "cpp_experience": background.cpp_experience,
        "ros_experience": background.ros_experience,
        "robotics_experience": background.robotics_experience,
        "software_projects_count": background.software_projects_count,
        "hardware_projects_count": background.hardware_projects_count,
        "hardware_platforms": background.hardware_platforms,
        "current_role": background.current_role,
        "preferred_language": background.preferred_language,
        "learning_pace": background.learning_pace,
        "learning_goals": background.learning_goals,
        "expertise_level": background.expertise_level,
    }
