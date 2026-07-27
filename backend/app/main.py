from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

# Ensure all SQLAlchemy models are registered before creating tables
import app.models  # noqa: F401

# Create database tables automatically if they don't exist
Base.metadata.create_all(bind=engine)

# Safely check & alter SQLite table to include new columns for legacy DBs
with engine.connect() as conn:
    for sql in [
        "ALTER TABLE resumes ADD COLUMN file_bytes BLOB;",
        "ALTER TABLE users ADD COLUMN location VARCHAR(255) DEFAULT 'India';",
        "ALTER TABLE users ADD COLUMN education VARCHAR(255) DEFAULT 'Computer Science';",
        "ALTER TABLE users ADD COLUMN experience_level VARCHAR(255) DEFAULT 'Entry Level';",
        "ALTER TABLE users ADD COLUMN preferred_job_type VARCHAR(255) DEFAULT 'Full Time';",
        "ALTER TABLE users ADD COLUMN preferred_work_mode VARCHAR(255) DEFAULT 'Hybrid';",
        "ALTER TABLE users ADD COLUMN skills_json TEXT;",
        "ALTER TABLE users ADD COLUMN career_interests_json TEXT;"
    ]:
        try:
            conn.execute(text(sql))
            conn.commit()
        except Exception:
            pass  # Column already exists

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS) for Frontend connection
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
if hasattr(settings, "BACKEND_CORS_ORIGINS") and settings.BACKEND_CORS_ORIGINS:
    for origin in settings.BACKEND_CORS_ORIGINS:
        if str(origin) not in allowed_origins:
            allowed_origins.append(str(origin))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API Router v1
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/api/health", tags=["Health Check"])
def health_check():
    """
    Health check endpoint to verify backend operational state.
    """
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
