import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class Case(Base):
    __tablename__ = "cases"
    id = Column(String, primary_key=True, default=lambda: "CASE-" + str(uuid.uuid4())[:8].upper())
    alert_id = Column(String, ForeignKey("alerts.id"), nullable=True)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    assigned_to = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Enum("low","medium","high","critical", name="case_priority"), default="medium")
    status = Column(Enum("open","in_progress","escalated","resolved","closed", name="case_status"), default="open")
    fraud_type = Column(String(100), nullable=True)   # card_not_present, account_takeover, identity_fraud
    risk_score = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    sla_deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
