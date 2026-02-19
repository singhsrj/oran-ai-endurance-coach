from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.routes.schemas import UserOut, UserUpdate, PasswordChange
from app.routes.auth_utils import get_current_user, hash_password, verify_password
from app.models.user import User
from app.models.workout import Workout

router = APIRouter()


@router.get("/me", response_model=UserOut)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get the authenticated user's profile"""
    return current_user


@router.put("/me", response_model=UserOut)
def update_user_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the authenticated user's profile"""
    # Update only provided fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change the authenticated user's password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update to new password
    current_user.hashed_password = hash_password(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}


@router.get("/weekly-activity")
def get_weekly_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get weekly activity data for the last 7 days"""
    today = datetime.now().date()
    week_ago = today - timedelta(days=6)  # Last 7 days including today
    
    # Get workouts for the last 7 days
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.date >= week_ago,
        Workout.date <= today
    ).order_by(Workout.date).all()
    
    # Create a dict with all 7 days
    activity_data = {}
    for i in range(7):
        day = week_ago + timedelta(days=i)
        activity_data[day.strftime("%Y-%m-%d")] = {
            "date": day.strftime("%Y-%m-%d"),
            "day": day.strftime("%a"),  # Mon, Tue, etc.
            "duration": 0,
            "training_load": 0,
            "workout_count": 0,
            "workout_types": []
        }
    
    # Aggregate workout data by date
    for workout in workouts:
        date_key = workout.date.strftime("%Y-%m-%d")
        if date_key in activity_data:
            activity_data[date_key]["duration"] += workout.duration
            activity_data[date_key]["training_load"] += workout.training_load_score or 0
            activity_data[date_key]["workout_count"] += 1
            activity_data[date_key]["workout_types"].append(workout.workout_type)
    
    # Convert to list and round values
    result = []
    for date_key in sorted(activity_data.keys()):
        data = activity_data[date_key]
        result.append({
            "date": data["date"],
            "day": data["day"],
            "duration": round(data["duration"], 1),
            "training_load": round(data["training_load"], 1),
            "workout_count": data["workout_count"],
            "workout_types": list(set(data["workout_types"]))  # Unique types
        })
    
    return {"weekly_activity": result}


