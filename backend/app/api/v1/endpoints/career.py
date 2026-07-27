import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.career import CompanyRoadmap
from app.schemas.career import CompanyRoadmapRequest, CompanyRoadmapResponse
from app.services.career_intelligence_service import career_intelligence_service

router = APIRouter()


@router.post("/company-roadmap", response_model=CompanyRoadmapResponse, status_code=status.HTTP_201_CREATED)
def generate_company_roadmap(
    req: CompanyRoadmapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates a company-specific interview preparation roadmap (e.g. TCS, Infosys, Accenture, Amazon, Google, Microsoft, Meta).
    Saves to database and returns structured interview round breakdown, priority topics, and course recommendations.
    """
    company_name = req.company_name.strip()
    target_role = req.target_role or current_user.target_role or "Software Engineer"

    # Check if existing roadmap exists for same user, company & role
    existing = db.query(CompanyRoadmap).filter(
        CompanyRoadmap.user_id == current_user.id,
        CompanyRoadmap.company_name.ilike(company_name),
        CompanyRoadmap.target_role.ilike(target_role)
    ).first()

    if existing:
        return CompanyRoadmapResponse.model_validate(existing.get_parsed_data())

    # Generate new company roadmap using Career Intelligence Service
    result = career_intelligence_service.generate_company_roadmap(company_name, target_role)

    new_roadmap = CompanyRoadmap(
        user_id=current_user.id,
        company_name=company_name,
        target_role=target_role,
        rounds_json=json.dumps(result.get("rounds", [])),
        key_topics_json=json.dumps(result.get("key_topics", [])),
        preparation_steps_json=json.dumps(result.get("preparation_steps", [])),
        courses_json=json.dumps(result.get("courses", []))
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    return CompanyRoadmapResponse.model_validate(new_roadmap.get_parsed_data())


@router.get("/company-roadmaps", response_model=List[CompanyRoadmapResponse])
def get_user_company_roadmaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all company-specific roadmaps saved by the current user.
    """
    records = db.query(CompanyRoadmap).filter(CompanyRoadmap.user_id == current_user.id).order_by(CompanyRoadmap.created_at.desc()).all()
    return [CompanyRoadmapResponse.model_validate(rec.get_parsed_data()) for rec in records]
