from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.career import StudyTask
from app.schemas.career import GeneratePlannerRequest, StudyTaskCreate, StudyTaskUpdate, StudyTaskResponse
from app.services.career_intelligence_service import career_intelligence_service

router = APIRouter()


@router.post("/generate-plan", response_model=List[StudyTaskResponse], status_code=status.HTTP_201_CREATED)
def generate_study_planner(
    req: GeneratePlannerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate an AI-driven 30/60/90 days daily study planner curriculum with recommended free & paid learning resources.
    Clears old incomplete default tasks and replaces with new personalized curriculum.
    """
    # Clear old tasks for this user so regeneration replaces the previous curriculum
    db.query(StudyTask).filter(StudyTask.user_id == current_user.id).delete()
    db.commit()

    target_role = req.target_role or current_user.target_role or "Software Engineer"
    timeline_days = req.timeline_days or 30

    tasks_data = career_intelligence_service.generate_daily_study_plan(target_role, timeline_days)

    created_tasks = []
    for item in tasks_data:
        task = StudyTask(
            user_id=current_user.id,
            day_number=item.get("day_number", 1),
            title=item.get("title", "Study Session"),
            description=item.get("description", ""),
            category=item.get("category", "Technical"),
            resource_name=item.get("resource_name", "Documentation"),
            resource_url=item.get("resource_url", "https://google.com"),
            is_free=item.get("is_free", True),
            duration_minutes=item.get("duration_minutes", 60),
            is_completed=False
        )
        db.add(task)
        created_tasks.append(task)

    db.commit()
    for task in created_tasks:
        db.refresh(task)

    return [StudyTaskResponse.model_validate(t.get_parsed_data()) for t in created_tasks]


@router.get("/tasks", response_model=List[StudyTaskResponse])
def get_user_study_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all study planner tasks for current authenticated user sorted by day number.
    """
    tasks = db.query(StudyTask).filter(StudyTask.user_id == current_user.id).order_by(StudyTask.day_number.asc()).all()
    
    return [StudyTaskResponse.model_validate(t.get_parsed_data()) for t in tasks]


@router.patch("/task/{task_id}", response_model=StudyTaskResponse)
def update_study_task(
    task_id: int,
    update_data: StudyTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Toggle task completion status (is_completed) or update details.
    """
    task = db.query(StudyTask).filter(StudyTask.id == task_id, StudyTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    if update_data.is_completed is not None:
        task.is_completed = update_data.is_completed
    if update_data.title is not None:
        task.title = update_data.title
    if update_data.description is not None:
        task.description = update_data.description

    db.commit()
    db.refresh(task)

    return StudyTaskResponse.model_validate(task.get_parsed_data())


@router.delete("/task/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a study task from the planner.
    """
    task = db.query(StudyTask).filter(StudyTask.id == task_id, StudyTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    db.delete(task)
    db.commit()
    return None
