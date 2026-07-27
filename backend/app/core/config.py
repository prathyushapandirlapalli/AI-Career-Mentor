import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings loaded from environment variables or .env file.
    Follows 12-factor app best practices.
    """
    PROJECT_NAME: str = "AI Career Mentor API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Configuration (MySQL / SQLite fallback)
    DATABASE_URL: str = "sqlite:///./career_mentor.db"

    # JWT Authentication Security Settings
    SECRET_KEY: str = "supersecretjwtkey_change_in_production_environment_32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Google Gemini AI Key
    GEMINI_API_KEY: str = "your-gemini-api-key-here"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Instantiate global settings instance
settings = Settings()
