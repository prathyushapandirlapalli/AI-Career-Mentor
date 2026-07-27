from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user in the AI Career Mentor system.
    Returns standard JWT bearer access token and user metadata upon successful registration.
    """
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Create new user instance with bcrypt hashed password
    new_user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        target_role=user_in.target_role or "Software Engineer"
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        print("DATABASE ERROR:", e)
        raise 
            

    # Issue access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=new_user.id, expires_delta=access_token_expires)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )


@router.post("/login", response_model=Token)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate existing user credentials (email & password) and issue JWT token.
    """
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is currently inactive."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


import json
from app.schemas.auth import UserCreate, UserLogin, UserResponse, UserProfileUpdate, Token

def format_user_response(user: User) -> dict:
    """Helper method to construct complete dict payload for UserResponse."""
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "target_role": user.target_role or "Senior Full Stack Engineer",
        "location": user.location or "India",
        "education": user.education or "Computer Science",
        "experience_level": user.experience_level or "Entry Level",
        "preferred_job_type": user.preferred_job_type or "Full Time",
        "preferred_work_mode": user.preferred_work_mode or "Hybrid",
        "skills": user.get_skills_list(),
        "career_interests": user.get_interests_list(),
        "is_active": user.is_active,
        "created_at": user.created_at
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Retrieve authenticated user's profile info.
    """
    return format_user_response(current_user)


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update authenticated user's profile metadata and preferences.
    """
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.location is not None:
        current_user.location = profile_in.location
    if profile_in.education is not None:
        current_user.education = profile_in.education
    if profile_in.target_role is not None:
        current_user.target_role = profile_in.target_role
    if profile_in.experience_level is not None:
        current_user.experience_level = profile_in.experience_level
    if profile_in.preferred_job_type is not None:
        current_user.preferred_job_type = profile_in.preferred_job_type
    if profile_in.preferred_work_mode is not None:
        current_user.preferred_work_mode = profile_in.preferred_work_mode

    if profile_in.skills is not None:
        current_user.skills_json = json.dumps(profile_in.skills)
    if profile_in.career_interests is not None:
        current_user.career_interests_json = json.dumps(profile_in.career_interests)

    db.commit()
    db.refresh(current_user)

    return format_user_response(current_user)
