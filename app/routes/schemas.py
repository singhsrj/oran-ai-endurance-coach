from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    sport: Optional[str] = None
    experience_level: Optional[str] = None
    goal: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    sport: Optional[str] = None
    experience_level: Optional[str] = None
    goal: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    age: Optional[int]
    height: Optional[float]
    weight: Optional[float]
    sport: Optional[str]
    experience_level: Optional[str]
    goal: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Logging Schemas
from datetime import date


class WorkoutCreate(BaseModel):
    date: date
    distance: Optional[float] = None  # km
    duration: float  # minutes
    avg_hr: Optional[int] = None  # bpm
    workout_type: str  # easy / tempo / interval / long / race


class WorkoutOut(BaseModel):
    id: int
    user_id: int
    date: date
    distance: Optional[float]
    duration: float
    avg_hr: Optional[int]
    workout_type: str
    training_load_score: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class SleepLogCreate(BaseModel):
    date: date
    hours: float
    quality_score: int  # 1-10


class SleepLogOut(BaseModel):
    id: int
    user_id: int
    date: date
    hours: float
    quality_score: int
    created_at: datetime

    class Config:
        from_attributes = True


class NutritionLogCreate(BaseModel):
    date: date
    calories: float
    protein: float  # grams
    carbs: float  # grams
    fats: float  # grams


class NutritionLogOut(BaseModel):
    id: int
    user_id: int
    date: date
    calories: float
    protein: float
    carbs: float
    fats: float
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard Schema
class RecommendationOut(BaseModel):
    """Schema for AI recommendation output"""
    id: int
    user_id: int
    date: date
    recommendation_json: Dict[str, Any]
    reasoning_summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardOut(BaseModel):
    """
    Complete dashboard data for frontend.
    Everything the React app needs in one response.
    """
    user: UserOut
    recent_workouts: List[WorkoutOut]
    recent_sleep: List[SleepLogOut]
    recent_nutrition: List[NutritionLogOut]
    metrics: Dict[str, Any]
    latest_recommendation: Optional[RecommendationOut]

