import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text
from app.core.database import Base


class Rule(Base):
    __tablename__ = "rules"

    id = Column(String, primary_key=True, default=lambda: "RUL-" + str(uuid.uuid4())[:8].upper())
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), default="transaction")   # transaction, location, device, behavioral
    action = Column(String(50), default="flag")            # flag, block, review, alert
    priority = Column(String(50), default="medium")        # low, medium, high
    condition_field = Column(String(100), nullable=True)   # e.g. "amount", "location_change"
    condition_operator = Column(String(20), nullable=True) # e.g. ">", "=", "contains"
    condition_value = Column(String(200), nullable=True)   # e.g. "10000", "500"
    condition_display = Column(String(300), nullable=True) # human readable
    risk_weight = Column(Float, default=50.0)
    active = Column(Boolean, default=True)
    trigger_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_triggered = Column(DateTime, nullable=True)
