import datetime
import json
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from app.core.database import Base


class User(Base):
    """
    SQLAlchemy Model representing the user entity in the database.
    Stores authentication details, personal attributes, career preferences, and skills.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Profile & Preferences (no artificial defaults)
    target_role = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    education = Column(String(255), nullable=True)
    experience_level = Column(String(255), nullable=True)
    preferred_job_type = Column(String(255), nullable=True)
    preferred_work_mode = Column(String(255), nullable=True)
    
    # JSON attributes
    skills_json = Column(Text, nullable=True)
    career_interests_json = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def get_skills_list(self):
        if self.skills_json:
            try:
                return json.loads(self.skills_json)
            except Exception:
                pass
        return []

    def get_interests_list(self):
        if self.career_interests_json:
            try:
                return json.loads(self.career_interests_json)
            except Exception:
                pass
        return []
