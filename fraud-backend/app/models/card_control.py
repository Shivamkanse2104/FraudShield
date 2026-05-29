import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, ForeignKey
from app.core.database import Base

class CardControl(Base):
    __tablename__ = "card_controls"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    card_frozen = Column(Boolean, default=False)
    daily_limit = Column(Float, default=100000.0)
    per_transaction_limit = Column(Float, default=50000.0)
    international_blocked = Column(Boolean, default=False)
    online_blocked = Column(Boolean, default=False)
    atm_blocked = Column(Boolean, default=False)
    travel_mode = Column(Boolean, default=False)
    travel_countries = Column(String(500), nullable=True)   # comma-separated ISO codes
    travel_start = Column(DateTime, nullable=True)
    travel_end = Column(DateTime, nullable=True)
    quick_block = Column(Boolean, default=False)            # emergency all-stop
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
