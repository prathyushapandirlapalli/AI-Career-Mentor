from fastapi import APIRouter
from app.api.v1.endpoints import auth, resume, career, interview, planner, progress

api_router = APIRouter()

# Register API Endpoint Modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(resume.router, prefix="/resume", tags=["Resume & AI Analysis"])
api_router.include_router(career.router, prefix="/career", tags=["Company Roadmaps & Intelligence"])
api_router.include_router(interview.router, prefix="/interview", tags=["AI Mock Interview"])
api_router.include_router(planner.router, prefix="/planner", tags=["Daily Study Planner"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress Dashboard"])
