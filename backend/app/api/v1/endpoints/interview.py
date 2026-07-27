import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.career import InterviewSession
from app.schemas.career import InterviewQuestionRequest, InterviewSessionResponse, SubmitAnswersRequest
from app.services.career_intelligence_service import career_intelligence_service

router = APIRouter()


@router.post("/generate-questions", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
def generate_interview_questions(
    req: InterviewQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate tailored interview questions based on candidate's uploaded resume content and target company/role.
    """
    resume_text = ""
    target_role = req.target_role or current_user.target_role or "Software Engineer"
    company_name = req.company_name or "General Tech Company"

    if req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
        if resume:
            resume_text = resume.extracted_text
    else:
        # Fetch candidate's latest resume if available
        latest_resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).first()
        if latest_resume:
            resume_text = latest_resume.extracted_text

    questions = career_intelligence_service.generate_interview_questions(
        resume_text=resume_text,
        target_role=target_role,
        company_name=company_name
    )

    session_record = InterviewSession(
        user_id=current_user.id,
        resume_id=req.resume_id,
        target_role=target_role,
        company_name=company_name,
        questions_json=json.dumps(questions),
        status="GENERATED",
        overall_score=0
    )
    db.add(session_record)
    db.commit()
    db.refresh(session_record)

    return InterviewSessionResponse.model_validate(session_record.get_parsed_data())


@router.post("/submit-answers", response_model=InterviewSessionResponse)
def submit_interview_answers(
    req: SubmitAnswersRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit answers for a mock interview session and compute AI evaluation scores & feedback.
    """
    session_record = db.query(InterviewSession).filter(
        InterviewSession.id == req.session_id,
        InterviewSession.user_id == current_user.id
    ).first()

    if not session_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found.")

    questions = json.loads(session_record.questions_json)
    user_answers_dict = [a.model_dump() for a in req.answers]

    evaluation = career_intelligence_service.evaluate_interview_responses(questions, user_answers_dict)

    session_record.user_answers_json = json.dumps(user_answers_dict)
    session_record.evaluation_json = json.dumps(evaluation)
    session_record.overall_score = evaluation.get("overall_score", 75)
    session_record.status = "COMPLETED"

    db.commit()
    db.refresh(session_record)

    return InterviewSessionResponse.model_validate(session_record.get_parsed_data())


@router.get("/sessions", response_model=List[InterviewSessionResponse])
def get_user_interview_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get history of user's AI Mock Interview sessions.
    """
    records = db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).order_by(InterviewSession.created_at.desc()).all()
    return [InterviewSessionResponse.model_validate(rec.get_parsed_data()) for rec in records]


@router.get("/session/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session_by_id(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch specific AI Mock Interview session details and score evaluation.
    """
    record = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

    return InterviewSessionResponse.model_validate(record.get_parsed_data())
