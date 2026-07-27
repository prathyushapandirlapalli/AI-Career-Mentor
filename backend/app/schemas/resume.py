from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict


class SkillGapItem(BaseModel):
    skill: str
    category: Optional[str] = "General"
    gap_level: str  # High, Medium, Low
    recommendation: str


class JobRecommendation(BaseModel):
    title: str
    match_percentage: int
    reason: str


class RoadmapPhase(BaseModel):
    phase: str
    goal: str
    estimated_hours: int
    topics: List[str]
    action_items: List[str]


class ResumeAnalysisResponse(BaseModel):
    id: int
    resume_id: int
    user_id: int
    target_role: str
    resume_score: int
    ats_score: int
    formatting_score: int
    impact_score: int
    summary_feedback: Optional[str] = None
    strengths: List[str]
    improvements: List[str]
    ats_keywords_found: List[str]
    ats_keywords_missing: List[str]
    skill_gap_analysis: List[SkillGapItem]
    job_recommendations: List[JobRecommendation]
    learning_roadmap: List[RoadmapPhase]
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class ResumeListItem(BaseModel):
    id: int
    filename: str
    file_size_bytes: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
