"""Authentication routes."""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, UserBackground, UserPreference
from app.schemas.auth import (
    SignupRequest,
    SigninRequest,
    AuthResponse,
    UserResponse,
    SessionResponse,
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    compute_expertise_level,
)
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with background information.

    Args:
        request: Signup request with email, password, name, and background
        db: Database session

    Returns:
        AuthResponse with access token and user data

    Raises:
        HTTPException: If email already exists or validation fails
    """
    # Check if user already exists
    stmt = select(User).where(User.email == request.email)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Compute expertise level from background
    expertise_level = compute_expertise_level(request.background.model_dump())

    # Create user
    user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        name=request.name,
    )
    db.add(user)
    await db.flush()  # Flush to get user ID

    # Create user background
    background_data = request.background.model_dump()
    background_data["user_id"] = user.id
    background_data["expertise_level"] = expertise_level
    user_background = UserBackground(**background_data)
    db.add(user_background)

    # Create user preferences
    user_preference = UserPreference(
        user_id=user.id,
        language="en",  # Default to English
    )
    db.add(user_preference)

    await db.commit()
    await db.refresh(user)

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            expertise_level=expertise_level,
        ),
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(request: SigninRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user and return access token.

    Args:
        request: Signin request with email and password
        db: Database session

    Returns:
        AuthResponse with access token and user data

    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    stmt = select(User).where(User.email == request.email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    # Get user background for expertise level
    stmt = select(UserBackground).where(UserBackground.user_id == user.id)
    result = await db.execute(stmt)
    background = result.scalars().first()

    expertise_level = background.expertise_level if background else "Beginner"

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            expertise_level=expertise_level,
        ),
    )


@router.get("/session", response_model=SessionResponse)
async def get_session(current_user: User = Depends(get_current_user)):
    """
    Validate and return current user session.

    Args:
        current_user: Current authenticated user

    Returns:
        SessionResponse with user data if authenticated
    """
    # Get user background for expertise level
    from sqlalchemy.ext.asyncio import AsyncSession
    from app.database import async_session_maker

    async with async_session_maker() as db:
        stmt = select(UserBackground).where(UserBackground.user_id == current_user.id)
        result = await db.execute(stmt)
        background = result.scalars().first()

    expertise_level = background.expertise_level if background else "Beginner"

    return SessionResponse(
        user=UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            name=current_user.name,
            expertise_level=expertise_level,
        ),
        authenticated=True,
    )


@router.post("/signout")
async def signout():
    """
    Signout user (client-side token deletion).

    Returns:
        Success message
    """
    return {"message": "Successfully signed out"}
