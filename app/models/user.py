from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    height = Column(Float, nullable=True)   # cm
    weight = Column(Float, nullable=True)   # kg
    sport = Column(String, nullable=True)   # e.g. "running", "cycling", "triathlon"
    experience_level = Column(String, nullable=True)  # beginner / intermediate / advanced
    goal = Column(String, nullable=True)    # e.g. "marathon", "weight loss", "base fitness"
    created_at = Column(DateTime, default=datetime.utcnow)
