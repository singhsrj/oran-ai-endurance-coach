"""
Training Engine - Fitness-Fatigue Model Implementation

This module implements the Performance Management Chart (PMC) model:
- CTL (Chronic Training Load) = Fitness (42-day exponential moving average)
- ATL (Acute Training Load) = Fatigue (7-day exponential moving average)
- TSB (Training Stress Balance) = Form (CTL - ATL)

Recovery score is based on sleep quality and training load.
"""

from datetime import datetime, timedelta, date
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.workout import Workout
from app.models.sleep_log import SleepLog


def calculate_exponential_moving_average(values: List[float], time_constant: int) -> float:
    """
    Calculate exponential moving average (EMA).
    
    Formula: EMA = yesterday_EMA + (today_value - yesterday_EMA) * (1 / time_constant)
    
    Args:
        values: List of training load values (most recent last)
        time_constant: Days for the time constant (42 for CTL, 7 for ATL)
    
    Returns:
        Current EMA value
    """
    if not values:
        return 0.0
    
    alpha = 2 / (time_constant + 1)  # Smoothing factor
    ema = values[0]  # Start with first value
    
    for value in values[1:]:
        ema = alpha * value + (1 - alpha) * ema
    
    return round(ema, 2)


def get_training_loads(db: Session, user_id: int, days: int = 42) -> List[float]:
    """
    Get daily training load scores for the last N days.
    
    Returns a list with one value per day (0 if no workout that day).
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)
    
    # Get all workouts in date range
    workouts = db.query(Workout).filter(
        Workout.user_id == user_id,
        Workout.date >= start_date,
        Workout.date <= end_date
    ).order_by(Workout.date).all()
    
    # Create daily training load list
    daily_loads = []
    workout_dict = {}
    
    # Sum training loads for each day (in case of multiple workouts per day)
    for workout in workouts:
        if workout.date not in workout_dict:
            workout_dict[workout.date] = 0
        workout_dict[workout.date] += workout.training_load_score or 0
    
    # Fill in all days with 0 for rest days
    current_date = start_date
    while current_date <= end_date:
        daily_loads.append(workout_dict.get(current_date, 0.0))
        current_date += timedelta(days=1)
    
    return daily_loads


def calculate_fitness_fatigue_form(db: Session, user_id: int) -> Dict[str, float]:
    """
    Calculate CTL (fitness), ATL (fatigue), and TSB (form).
    
    Returns:
        {
            "ctl": Chronic Training Load (42-day EMA) - fitness
            "atl": Acute Training Load (7-day EMA) - fatigue
            "tsb": Training Stress Balance (CTL - ATL) - form
        }
    """
    # Get training loads for last 42 days
    training_loads = get_training_loads(db, user_id, days=42)
    
    if not training_loads or sum(training_loads) == 0:
        return {"ctl": 0.0, "atl": 0.0, "tsb": 0.0}
    
    # Calculate CTL (Chronic Training Load) - 42 day exponential moving average
    ctl = calculate_exponential_moving_average(training_loads, time_constant=42)
    
    # Calculate ATL (Acute Training Load) - 7 day exponential moving average
    # Use last 7 days only
    recent_loads = training_loads[-7:] if len(training_loads) >= 7 else training_loads
    atl = calculate_exponential_moving_average(recent_loads, time_constant=7)
    
    # Calculate TSB (Training Stress Balance) = Form
    tsb = round(ctl - atl, 2)
    
    return {
        "ctl": ctl,  # Fitness (higher is better, but build gradually)
        "atl": atl,  # Fatigue (lower is better for recovery)
        "tsb": tsb   # Form (-30 to -10: optimal for training, 5-25: peak performance)
    }


def calculate_recovery_score(db: Session, user_id: int) -> Dict[str, any]:
    """
    Calculate recovery score based on sleep quality and training load.
    
    Returns score 0-100 where:
    - 80-100: Fully recovered, ready for hard training
    - 60-79: Moderate recovery, easy training recommended
    - 40-59: Low recovery, consider rest
    - 0-39: Poor recovery, rest required
    """
    # Get last 3 days of sleep
    end_date = date.today()
    start_date = end_date - timedelta(days=2)
    
    sleep_logs = db.query(SleepLog).filter(
        SleepLog.user_id == user_id,
        SleepLog.date >= start_date,
        SleepLog.date <= end_date
    ).order_by(SleepLog.date.desc()).limit(3).all()
    
    # Calculate sleep component (50% of score)
    if sleep_logs:
        avg_sleep_hours = sum(log.hours for log in sleep_logs) / len(sleep_logs)
        avg_sleep_quality = sum(log.quality_score for log in sleep_logs) / len(sleep_logs)
        
        # Optimal sleep: 7-9 hours
        sleep_hours_score = min(100, (avg_sleep_hours / 8.0) * 100)
        sleep_quality_score = (avg_sleep_quality / 10.0) * 100
        
        sleep_component = (sleep_hours_score + sleep_quality_score) / 2
    else:
        sleep_component = 50  # Neutral if no data
    
    # Calculate training stress component (50% of score)
    # Lower ATL relative to CTL = better recovery
    fitness_metrics = calculate_fitness_fatigue_form(db, user_id)
    ctl = fitness_metrics["ctl"]
    atl = fitness_metrics["atl"]
    tsb = fitness_metrics["tsb"]
    
    if ctl > 0:
        # TSB interpretation:
        # Positive TSB = good recovery
        # Negative TSB = accumulated fatigue
        if tsb >= 10:
            stress_component = 100  # Fully recovered
        elif tsb >= 0:
            stress_component = 75 + (tsb / 10 * 25)  # Recovering
        elif tsb >= -15:
            stress_component = 50 + ((tsb + 15) / 15 * 25)  # Moderate fatigue
        else:
            stress_component = max(0, 50 + (tsb / 30 * 50))  # High fatigue
    else:
        stress_component = 75  # No training history, assume recovered
    
    # Combined recovery score
    recovery_score = round((sleep_component * 0.5 + stress_component * 0.5), 1)
    
    # Recommendation
    if recovery_score >= 80:
        recommendation = "Fully recovered - ready for hard training"
    elif recovery_score >= 60:
        recommendation = "Moderate recovery - easy/moderate training recommended"
    elif recovery_score >= 40:
        recommendation = "Low recovery - consider rest or very easy activity"
    else:
        recommendation = "Poor recovery - rest required"
    
    return {
        "recovery_score": recovery_score,
        "recommendation": recommendation,
        "sleep_quality": round(sleep_component, 1),
        "training_stress": round(stress_component, 1)
    }


def get_training_metrics(db: Session, user_id: int) -> Dict[str, any]:
    """
    Get all training metrics for a user.
    
    Returns comprehensive metrics including fitness, fatigue, form, and recovery.
    """
    fitness_metrics = calculate_fitness_fatigue_form(db, user_id)
    recovery_metrics = calculate_recovery_score(db, user_id)
    
    # Get recent training load (last 7 days)
    recent_loads = get_training_loads(db, user_id, days=7)
    weekly_load = round(sum(recent_loads), 2)
    
    # Interpret TSB
    tsb = fitness_metrics["tsb"]
    if tsb < -30:
        form_status = "Overreaching - high risk of overtraining"
    elif tsb < -10:
        form_status = "Optimal training zone - building fitness"
    elif tsb < 5:
        form_status = "Maintaining fitness"
    elif tsb < 25:
        form_status = "Peak form - race ready"
    else:
        form_status = "Detraining - consider increasing training load"
    
    return {
        "fitness": {
            "ctl": fitness_metrics["ctl"],
            "description": "Chronic Training Load - your overall fitness level"
        },
        "fatigue": {
            "atl": fitness_metrics["atl"],
            "description": "Acute Training Load - your recent training stress"
        },
        "form": {
            "tsb": fitness_metrics["tsb"],
            "status": form_status,
            "description": "Training Stress Balance - readiness to perform"
        },
        "recovery": recovery_metrics,
        "weekly_training_load": weekly_load
    }
