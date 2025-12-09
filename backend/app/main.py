"""FastAPI main application."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_db, close_db
from app.routers import auth, users, lessons, quizzes, progress, recommendations


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events."""
    # Startup
    print("⚙️  Initializing database...")
    await init_db()
    print("✅ Database initialized")

    yield

    # Shutdown
    print("🛑 Closing database...")
    await close_db()
    print("✅ Database closed")


# Create FastAPI application
app = FastAPI(
    title="QuantumPages Backend",
    description="FastAPI backend for personalized physics AI learning platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "QuantumPages Backend",
    }


# Include routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_PREFIX}/auth",
    tags=["Authentication"],
)
app.include_router(
    users.router,
    prefix=f"{settings.API_V1_PREFIX}/users",
    tags=["Users"],
)
app.include_router(
    lessons.router,
    prefix=f"{settings.API_V1_PREFIX}/lessons",
    tags=["Lessons"],
)
app.include_router(
    quizzes.router,
    prefix=f"{settings.API_V1_PREFIX}/quizzes",
    tags=["Quizzes"],
)
app.include_router(
    progress.router,
    prefix=f"{settings.API_V1_PREFIX}/progress",
    tags=["Progress"],
)
app.include_router(
    recommendations.router,
    prefix=f"{settings.API_V1_PREFIX}/recommendations",
    tags=["Recommendations"],
)


# Error handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
