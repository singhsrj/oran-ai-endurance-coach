from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Date
from app.database import Base


class NutritionLog(Base):
    __tablename__ = "nutrition_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    calories = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)  # grams
    carbs = Column(Float, nullable=False)    # grams
    fats = Column(Float, nullable=False)     # grams
    created_at = Column(DateTime, default=datetime.utcnow)
