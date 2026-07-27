import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import Resume, ResumeAnalysis
from app.schemas.resume import ResumeAnalysisResponse, ResumeListItem
from app.services.pdf_service import extract_text_from_pdf_bytes, PDFExtractionError
from app.services.gemini_service import gemini_service
from app.services.report_generator import generate_career_report_pdf

router = APIRouter()


@router.post("/upload-and-analyze", response_model=ResumeAnalysisResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form("Software Engineer"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a PDF Resume, extract raw text, execute AI Analysis via Gemini API,
    persist results to DB, and return comprehensive career evaluation metrics.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF format files (.pdf) are supported."
        )

    # Read binary bytes
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed threshold of 10MB."
        )

    # 1. Extract text from PDF
    try:
        extracted_text = extract_text_from_pdf_bytes(contents)
    except PDFExtractionError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    # 2. Persist raw Resume record
    db_resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_size_bytes=len(contents),
        extracted_text=extracted_text
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    # 3. Perform AI Resume & ATS Analysis using Gemini
    ai_result = gemini_service.analyze_resume(extracted_text, target_role=target_role)

    # 4. Save analysis to database
    analysis_record = ResumeAnalysis(
        resume_id=db_resume.id,
        user_id=current_user.id,
        target_role=target_role,
        resume_score=ai_result.get("resume_score", 70),
        ats_score=ai_result.get("ats_score", 70),
        formatting_score=ai_result.get("formatting_score", 80),
        impact_score=ai_result.get("impact_score", 75),
        summary_feedback=ai_result.get("summary_feedback", ""),
        strengths_json=json.dumps(ai_result.get("strengths", [])),
        improvements_json=json.dumps(ai_result.get("improvements", [])),
        ats_keywords_found_json=json.dumps(ai_result.get("ats_keywords_found", [])),
        ats_keywords_missing_json=json.dumps(ai_result.get("ats_keywords_missing", [])),
        skill_gap_json=json.dumps(ai_result.get("skill_gap_analysis", [])),
        job_recommendations_json=json.dumps(ai_result.get("job_recommendations", [])),
        learning_roadmap_json=json.dumps(ai_result.get("learning_roadmap", []))
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    return ResumeAnalysisResponse.model_validate(analysis_record.get_parsed_data())


@router.get("/analyses", response_model=List[ResumeAnalysisResponse])
def get_user_resume_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all historical AI resume analysis reports for current authenticated user.
    """
    records = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).order_by(ResumeAnalysis.created_at.desc()).all()
    return [ResumeAnalysisResponse.model_validate(rec.get_parsed_data()) for rec in records]


@router.get("/analysis/{analysis_id}", response_model=ResumeAnalysisResponse)
def get_resume_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get specific AI resume analysis report by analysis ID.
    """
    record = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id,
        ResumeAnalysis.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")

    return ResumeAnalysisResponse.model_validate(record.get_parsed_data())


@router.get("/analysis/{analysis_id}/pdf")
def download_resume_report_pdf(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates and returns a downloadable PDF Report for the specified AI Resume Analysis.
    """
    record = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id,
        ResumeAnalysis.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")

    parsed_data = record.get_parsed_data()
    
    # Generate binary PDF
    pdf_bytes = generate_career_report_pdf(
        user_name=current_user.full_name,
        user_email=current_user.email,
        target_role=record.target_role,
        analysis_data=parsed_data
    )

    filename = f"AI_Career_Report_{current_user.full_name.replace(' ', '_')}_{analysis_id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
