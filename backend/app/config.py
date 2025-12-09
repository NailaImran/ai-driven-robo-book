"""Application configuration."""

import json
from pydantic_settings import BaseSettings
from typing import List, Union


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/quantumpages"

    # Vector Database (Qdrant)
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION_NAME: str = "lessons"

    # OpenAI API
    OPENAI_API_KEY: str = ""

    # JWT Configuration
    JWT_SECRET_KEY: str = "your_secret_key_min_32_characters_long_here"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 168  # 7 days

    # CORS Configuration (can be JSON string or list)
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "https://quantum-pages.vercel.app",
    ]

    # Server Configuration
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    API_V1_PREFIX: str = "/api/v1"

    # File Paths
    LESSONS_DIR: str = "../physical-ai-textbook/docs"

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS if it's a JSON string
        if isinstance(self.CORS_ORIGINS, str):
            try:
                self.CORS_ORIGINS = json.loads(self.CORS_ORIGINS)
            except json.JSONDecodeError:
                # If not JSON, try comma-separated
                self.CORS_ORIGINS = [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()
