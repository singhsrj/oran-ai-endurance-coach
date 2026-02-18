from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Date
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    recommendation_json = Column(JSONB, nullable=False)  # structured LLM output
    reasoning_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
