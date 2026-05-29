import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=lambda: "ALT-" + str(uuid.uuid4())[:8].upper())
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=True)
    alert_type = Column(String(50), default="transaction")   # transaction, user, device, security
    priority = Column(Enum("low", "medium", "high", "critical", name="alert_priority"), default="medium")
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    risk_score = Column(Float, default=0.0)
    amount = Column(Float, nullable=True)
    status = Column(Enum("new", "investigating", "resolved", name="alert_status"), default="new")
    resolution = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="alerts")
