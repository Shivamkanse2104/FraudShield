import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum
from app.core.database import Base

class Watchlist(Base):
    __tablename__ = "watchlist"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    added_by = Column(String, ForeignKey("users.id"), nullable=True)
    reason = Column(String(200), nullable=False)
    level = Column(Enum("monitor","high_risk","blocked", name="watch_level"), default="monitor")
    notes = Column(Text, nullable=True)
    active = Column(String, default="true")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
