import datetime
import json
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base


class Resume(Base):
    """
    SQLAlchemy Model representing uploaded PDF Resumes.
    """
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_size_bytes = Column(Integer, nullable=False, default=0)
    extracted_text = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", backref="resumes")
    analyses = relationship("ResumeAnalysis", back_populates="resume", cascade="all, delete-orphan")


class ResumeAnalysis(Base):
    """
    SQLAlchemy Model representing the AI Analysis result for a resume.
    Stores structured JSON evaluations and calculated metrics.
    """
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_role = Column(String(255), nullable=False, default="Software Engineer")
    
    # Quantitative Scores (0-100)
    resume_score = Column(Integer, nullable=False, default=0)
    ats_score = Column(Integer, nullable=False, default=0)
    formatting_score = Column(Integer, nullable=False, default=0)
    impact_score = Column(Integer, nullable=False, default=0)

    # Narrative AI Output
    summary_feedback = Column(Text, nullable=True)

    # JSON Stored Attributes
    strengths_json = Column(Text, nullable=True)
    improvements_json = Column(Text, nullable=True)
    ats_keywords_found_json = Column(Text, nullable=True)
    ats_keywords_missing_json = Column(Text, nullable=True)
    skill_gap_json = Column(Text, nullable=True)
    job_recommendations_json = Column(Text, nullable=True)
    learning_roadmap_json = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="analyses")
    user = relationship("User", backref="resume_analyses")

    def get_parsed_data(self) -> dict:
        """Helper method to deserialize stored JSON strings into structured dict."""
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "user_id": self.user_id,
            "target_role": self.target_role,
            "resume_score": self.resume_score,
            "ats_score": self.ats_score,
            "formatting_score": self.formatting_score,
            "impact_score": self.impact_score,
            "summary_feedback": self.summary_feedback,
            "strengths": json.loads(self.strengths_json) if self.strengths_json else [],
            "improvements": json.loads(self.improvements_json) if self.improvements_json else [],
            "ats_keywords_found": json.loads(self.ats_keywords_found_json) if self.ats_keywords_found_json else [],
            "ats_keywords_missing": json.loads(self.ats_keywords_missing_json) if self.ats_keywords_missing_json else [],
            "skill_gap_analysis": json.loads(self.skill_gap_json) if self.skill_gap_json else [],
            "job_recommendations": json.loads(self.job_recommendations_json) if self.job_recommendations_json else [],
            "learning_roadmap": json.loads(self.learning_roadmap_json) if self.learning_roadmap_json else [],
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
