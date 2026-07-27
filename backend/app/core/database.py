import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Base class for SQLAlchemy models
Base = declarative_base()

db_url = settings.DATABASE_URL
connect_args = {}

# Handle SQLite specific settings
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    # Create SQLAlchemy database engine
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,  # Automatically check & reconnect stale DB connections
        echo=False
    )
    # Test connection
    with engine.connect() as conn:
        logger.info(f"Successfully connected to database: {db_url.split('@')[-1] if '@' in db_url else db_url}")
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({db_url}): {e}. Falling back to local SQLite.")
    fallback_url = "sqlite:///./career_mentor.db"
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False}, pool_pre_ping=True)

# Session factory for handling DB sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Dependency generator for FastAPI routes to acquire and release DB sessions safely.
    Ensures session closure even if an exception occurs during request processing.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
