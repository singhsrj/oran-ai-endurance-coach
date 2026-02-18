from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Date
from app.database import Base


class SleepLog(Base):
    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    hours = Column(Float, nullable=False)          # total sleep hours
    quality_score = Column(Integer, nullable=False) # 1–10 subjective score
    created_at = Column(DateTime, default=datetime.utcnow)
