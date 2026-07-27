from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    """Schema for user registration request payload."""
    email: EmailStr
    full_name: str
    password: str
    target_role: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login request payload."""
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    """Schema for profile update request payload."""
    full_name: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    skills: Optional[List[str]] = None
    career_interests: Optional[List[str]] = None


class UserResponse(BaseModel):
    """Schema for public user profile output."""
    id: int
    email: str
    full_name: str
    target_role: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    experience_level: Optional[str] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    skills: Optional[List[str]] = None
    career_interests: Optional[List[str]] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Schema for JWT authentication response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    """Schema for decoded JWT token contents."""
    sub: Optional[str] = None
