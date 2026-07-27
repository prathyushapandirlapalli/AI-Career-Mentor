import datetime
import json
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class CompanyRoadmap(Base):
    """
    SQLAlchemy model storing company-specific interview preparation roadmaps
    (e.g., TCS, Infosys, Accenture, Amazon, Google, Microsoft, Meta).
    """
    __tablename__ = "company_roadmaps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    target_role = Column(String(255), nullable=False, default="Software Engineer")
    
    rounds_json = Column(Text, nullable=True)         # Round breakdowns (OA, Tech 1, Tech 2, HR)
    key_topics_json = Column(Text, nullable=True)     # Priority DSA / System Design topics
    preparation_steps_json = Column(Text, nullable=True) # 30/60/90 day step roadmap
    courses_json = Column(Text, nullable=True)        # Free and paid course links

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", backref="company_roadmaps")

    def get_parsed_data(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_name": self.company_name,
            "target_role": self.target_role,
            "rounds": json.loads(self.rounds_json) if self.rounds_json else [],
            "key_topics": json.loads(self.key_topics_json) if self.key_topics_json else [],
            "preparation_steps": json.loads(self.preparation_steps_json) if self.preparation_steps_json else [],
            "courses": json.loads(self.courses_json) if self.courses_json else [],
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class InterviewSession(Base):
    """
    SQLAlchemy model for AI Mock Interview sessions and question evaluations.
    """
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(255), nullable=False, default="Software Engineer")
    company_name = Column(String(255), nullable=True, default="General Tech Company")
    
    questions_json = Column(Text, nullable=False)    # List of questions with hints and ideal answers
    user_answers_json = Column(Text, nullable=True)  # Candidate's submitted responses
    evaluation_json = Column(Text, nullable=True)    # Detailed feedback & per-question scores
    
    overall_score = Column(Integer, nullable=False, default=0)
    status = Column(String(50), nullable=False, default="GENERATED")  # GENERATED, COMPLETED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", backref="interview_sessions")

    def get_parsed_data(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "resume_id": self.resume_id,
            "target_role": self.target_role,
            "company_name": self.company_name,
            "questions": json.loads(self.questions_json) if self.questions_json else [],
            "user_answers": json.loads(self.user_answers_json) if self.user_answers_json else [],
            "evaluation": json.loads(self.evaluation_json) if self.evaluation_json else {},
            "overall_score": self.overall_score,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class StudyTask(Base):
    """
    SQLAlchemy model for Daily Study Planner tasks (30, 60, 90 day roadmaps).
    """
    __tablename__ = "study_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    day_number = Column(Integer, nullable=False, default=1)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, default="Technical")
    resource_url = Column(String(500), nullable=True)
    resource_name = Column(String(255), nullable=True)
    is_free = Column(Boolean, default=True)
    duration_minutes = Column(Integer, default=45)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", backref="study_tasks")

    def get_parsed_data(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "day_number": self.day_number,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "resource_url": self.resource_url,
            "resource_name": self.resource_name,
            "is_free": self.is_free,
            "duration_minutes": self.duration_minutes,
            "is_completed": self.is_completed,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
