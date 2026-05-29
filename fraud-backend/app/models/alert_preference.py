import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey
from app.core.database import Base

class AlertPreference(Base):
    __tablename__ = "alert_preferences"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    email_alerts = Column(Boolean, default=True)
    sms_alerts = Column(Boolean, default=False)
    push_alerts = Column(Boolean, default=True)
    threshold_amount = Column(Float, default=10000.0)       # alert when tx > this
    alert_on_foreign = Column(Boolean, default=True)
    alert_on_new_device = Column(Boolean, default=True)
    alert_on_large_tx = Column(Boolean, default=True)
    alert_on_blocked = Column(Boolean, default=True)
    min_risk_score = Column(Float, default=60.0)            # alert when risk >= this
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
