from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.database import get_db
from app.routes.schemas import (
    WorkoutCreate, WorkoutOut,
    SleepLogCreate, SleepLogOut,
    NutritionLogCreate, NutritionLogOut,
    DashboardOut, RecommendationOut
)
from app.routes.auth_utils import get_current_user
from app.models.user import User
from app.models.workout import Workout
from app.models.sleep_log import SleepLog
from app.models.nutrition_log import NutritionLog

router = APIRouter()


def calculate_training_load(duration: float, workout_type: str, avg_hr: int = None) -> float:
    """
    Calculate training load score based on duration, workout type, and heart rate.
    This is a simplified calculation for Phase 4.
    Formula: duration * intensity_factor * (hr_factor if available)
    """
    # Intensity factors by workout type
    intensity_map = {
        "easy": 1.0,
        "tempo": 1.5,
        "interval": 2.0,
        "long": 1.2,
        "race": 2.5
    }
    
    intensity_factor = intensity_map.get(workout_type.lower(), 1.0)
    
    # Base score: duration * intensity
    base_score = duration * intensity_factor
    
    # Heart rate adjustment (if provided)
    if avg_hr:
        # Simplified HR zones: <130 (easy), 130-150 (moderate), 150-170 (hard), >170 (max)
        if avg_hr < 130:
            hr_factor = 1.0
        elif avg_hr < 150:
            hr_factor = 1.2
        elif avg_hr < 170:
            hr_factor = 1.5
        else:
            hr_factor = 1.8
        
        base_score *= hr_factor
    
    return round(base_score, 2)


@router.post("/log-workout", response_model=WorkoutOut, status_code=status.HTTP_201_CREATED)
def log_workout(
    workout_data: WorkoutCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a workout and calculate training load score"""
    
    # Calculate training load
    training_load = calculate_training_load(
        duration=workout_data.duration,
        workout_type=workout_data.workout_type,
        avg_hr=workout_data.avg_hr
    )
    
    # Create workout record
    workout = Workout(
        user_id=current_user.id,
        date=workout_data.date,
        distance=workout_data.distance,
        duration=workout_data.duration,
        avg_hr=workout_data.avg_hr,
        workout_type=workout_data.workout_type,
        training_load_score=training_load
    )
    
    db.add(workout)
    db.commit()
    db.refresh(workout)
    
    return workout


@router.post("/log-sleep", response_model=SleepLogOut, status_code=status.HTTP_201_CREATED)
def log_sleep(
    sleep_data: SleepLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log sleep data"""
    
    sleep_log = SleepLog(
        user_id=current_user.id,
        date=sleep_data.date,
        hours=sleep_data.hours,
        quality_score=sleep_data.quality_score
    )
    
    db.add(sleep_log)
    db.commit()
    db.refresh(sleep_log)
    
    return sleep_log


@router.post("/log-nutrition", response_model=NutritionLogOut, status_code=status.HTTP_201_CREATED)
def log_nutrition(
    nutrition_data: NutritionLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log daily nutrition data"""
    
    nutrition_log = NutritionLog(
        user_id=current_user.id,
        date=nutrition_data.date,
        calories=nutrition_data.calories,
        protein=nutrition_data.protein,
        carbs=nutrition_data.carbs,
        fats=nutrition_data.fats
    )
    
    db.add(nutrition_log)
    db.commit()
    db.refresh(nutrition_log)
    
    return nutrition_log


@router.get("/metrics")
def get_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive training metrics including:
    - CTL (Chronic Training Load / Fitness)
    - ATL (Acute Training Load / Fatigue)
    - TSB (Training Stress Balance / Form)
    - Recovery Score
    - Weekly Training Load
    """
    from app.services.training_engine import get_training_metrics
    
    metrics = get_training_metrics(db, current_user.id)
    return metrics


@router.post("/recommend")
def get_ai_recommendation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-powered workout recommendation using LangGraph and Fireworks AI.
    
    The recommendation is based on:
    - Current training metrics (fitness, fatigue, form)
    - Recovery status
    - User's experience level and goals
    - Recent training history
    
    Returns personalized workout with reasoning and safety validation.
    """
    from app.services.ai_coach import generate_workout_recommendation
    
    recommendation = generate_workout_recommendation(db, current_user)
    return recommendation


@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get complete dashboard data for the frontend.
    
    Returns everything the React app needs in one response:
    - User profile
    - Recent workouts (last 30 days)
    - Recent sleep logs (last 30 days)
    - Recent nutrition logs (last 30 days)
    - Current training metrics (CTL, ATL, TSB, recovery)
    - Latest AI recommendation
    """
    from app.services.training_engine import get_training_metrics
    from app.models.recommendation import Recommendation
    
    # Calculate date range for recent data (last 30 days)
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)
    
    # Get recent workouts
    recent_workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.date >= thirty_days_ago
    ).order_by(Workout.date.desc()).all()
    
    # Get recent sleep logs
    recent_sleep = db.query(SleepLog).filter(
        SleepLog.user_id == current_user.id,
        SleepLog.date >= thirty_days_ago
    ).order_by(SleepLog.date.desc()).all()
    
    # Get recent nutrition logs
    recent_nutrition = db.query(NutritionLog).filter(
        NutritionLog.user_id == current_user.id,
        NutritionLog.date >= thirty_days_ago
    ).order_by(NutritionLog.date.desc()).all()
    
    # Get current training metrics
    metrics = get_training_metrics(db, current_user.id)
    
    # Get latest recommendation (most recent)
    latest_recommendation = db.query(Recommendation).filter(
        Recommendation.user_id == current_user.id
    ).order_by(Recommendation.created_at.desc()).first()
    
    return DashboardOut(
        user=current_user,
        recent_workouts=recent_workouts,
        recent_sleep=recent_sleep,
        recent_nutrition=recent_nutrition,
        metrics=metrics,
        latest_recommendation=latest_recommendation
    )
