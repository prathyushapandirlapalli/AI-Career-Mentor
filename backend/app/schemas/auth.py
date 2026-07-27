from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    """Schema for user registration request payload."""
    email: EmailStr
    full_name: str
    password: str
    target_role: Optional[str] = "Software Engineer"


class UserLogin(BaseModel):
    """Schema for user login request payload."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for public user profile output."""
    id: int
    email: str
    full_name: str
    target_role: Optional[str] = None
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
