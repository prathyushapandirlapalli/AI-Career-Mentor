from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.models.career import InterviewSession, StudyTask
from app.schemas.career import ProgressDashboardResponse

router = APIRouter()


@router.get("/dashboard", response_model=ProgressDashboardResponse)
def get_progress_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Computes aggregate metrics for the Progress Dashboard:
    - Overall Career Readiness Score
    - Latest Resume & ATS scores
    - Mock Interview average score & count
    - Daily Study Planner completion percentage & streak
    - Skill proficiency breakdown
    """
    # 1. Latest Resume Analysis
    latest_analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.user_id == current_user.id
    ).order_by(ResumeAnalysis.created_at.desc()).first()

    latest_resume_score = latest_analysis.resume_score if latest_analysis else 0
    latest_ats_score = latest_analysis.ats_score if latest_analysis else 0

    # 2. Mock Interview statistics
    interview_count = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id,
        InterviewSession.status == "COMPLETED"
    ).count()

    avg_interview = db.query(func.avg(InterviewSession.overall_score)).filter(
        InterviewSession.user_id == current_user.id,
        InterviewSession.status == "COMPLETED"
    ).scalar() or 0
    avg_interview_score = int(avg_interview)

    # 3. Study Planner statistics
    total_tasks = db.query(StudyTask).filter(StudyTask.user_id == current_user.id).count()
    completed_tasks = db.query(StudyTask).filter(
        StudyTask.user_id == current_user.id,
        StudyTask.is_completed == True
    ).count()

    completion_percentage = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    # Calculate overall readiness score (Weighted combination)
    readiness_components = []
    if latest_resume_score > 0:
        readiness_components.append(latest_resume_score * 0.4)
    if avg_interview_score > 0:
        readiness_components.append(avg_interview_score * 0.3)
    if completion_percentage > 0:
        readiness_components.append(completion_percentage * 0.3)

    overall_readiness_score = int(sum(readiness_components)) if readiness_components else 0

    # Skill breakdown: Only generate if user has completed at least 1 evaluation or study task
    if latest_resume_score == 0 and avg_interview_score == 0 and completion_percentage == 0:
        skill_breakdown = []
    else:
        skill_breakdown = [
            {"skill": "Technical Knowledge", "score": latest_resume_score},
            {"skill": "ATS Keyword Optimization", "score": latest_ats_score},
            {"skill": "Interview Practice", "score": avg_interview_score},
            {"skill": "Consistency & Study", "score": int(completion_percentage)},
            {"skill": "System Architecture", "score": int((latest_resume_score + avg_interview_score) / 2) if (latest_resume_score or avg_interview_score) else 0}
        ]

    return ProgressDashboardResponse(
        overall_readiness_score=overall_readiness_score,
        latest_resume_score=latest_resume_score,
        latest_ats_score=latest_ats_score,
        mock_interviews_completed=interview_count,
        average_interview_score=avg_interview_score,
        total_study_tasks=total_tasks,
        completed_study_tasks=completed_tasks,
        completion_percentage=completion_percentage,
        study_streak_days=completed_tasks if completed_tasks > 0 else 0,
        skill_breakdown=skill_breakdown
    )
