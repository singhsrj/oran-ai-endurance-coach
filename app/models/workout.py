from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Date
from app.database import Base


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    distance = Column(Float, nullable=True)       # km
    duration = Column(Float, nullable=False)      # minutes
    avg_hr = Column(Integer, nullable=True)       # bpm
    workout_type = Column(String, nullable=False) # easy / tempo / interval / long / race
    training_load_score = Column(Float, nullable=True)  # computed on insert
    created_at = Column(DateTime, default=datetime.utcnow)
