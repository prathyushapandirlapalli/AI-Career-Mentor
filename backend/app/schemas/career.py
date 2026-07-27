from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict


# --- Company Roadmap Schemas ---
class CompanyRoadmapRequest(BaseModel):
    company_name: str  # e.g., TCS, Infosys, Accenture, Amazon, Google, Microsoft
    target_role: Optional[str] = "Software Engineer"


class CompanyRoadmapResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    target_role: str
    rounds: List[Dict[str, Any]]
    key_topics: List[str]
    preparation_steps: List[Dict[str, Any]]
    courses: List[Dict[str, Any]]
    created_at: str

    model_config = ConfigDict(from_attributes=True)


# --- Interview Schemas ---
class InterviewQuestionRequest(BaseModel):
    resume_id: Optional[int] = None
    target_role: Optional[str] = "Software Engineer"
    company_name: Optional[str] = "General Tech Company"


class InterviewSessionResponse(BaseModel):
    id: int
    user_id: int
    resume_id: Optional[int] = None
    target_role: str
    company_name: str
    questions: List[Dict[str, Any]]
    user_answers: Optional[List[Dict[str, Any]]] = []
    evaluation: Optional[Dict[str, Any]] = {}
    overall_score: int
    status: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class AnswerItem(BaseModel):
    question_id: int
    answer: str


class SubmitAnswersRequest(BaseModel):
    session_id: int
    answers: List[AnswerItem]


# --- Study Planner Schemas ---
class GeneratePlannerRequest(BaseModel):
    target_role: Optional[str] = "Software Engineer"
    timeline_days: Optional[int] = 30


class StudyTaskCreate(BaseModel):
    day_number: int
    title: str
    description: Optional[str] = ""
    category: Optional[str] = "Technical"
    resource_name: Optional[str] = ""
    resource_url: Optional[str] = ""
    is_free: Optional[bool] = True
    duration_minutes: Optional[int] = 45


class StudyTaskUpdate(BaseModel):
    is_completed: Optional[bool] = None
    title: Optional[str] = None
    description: Optional[str] = None


class StudyTaskResponse(BaseModel):
    id: int
    user_id: int
    day_number: int
    title: str
    description: Optional[str] = None
    category: str
    resource_url: Optional[str] = None
    resource_name: Optional[str] = None
    is_free: bool
    duration_minutes: int
    is_completed: bool
    created_at: str

    model_config = ConfigDict(from_attributes=True)


# --- Progress Dashboard Schema ---
class ProgressDashboardResponse(BaseModel):
    overall_readiness_score: int
    latest_resume_score: int
    latest_ats_score: int
    mock_interviews_completed: int
    average_interview_score: int
    total_study_tasks: int
    completed_study_tasks: int
    completion_percentage: float
    study_streak_days: int
    skill_breakdown: List[Dict[str, Any]]
