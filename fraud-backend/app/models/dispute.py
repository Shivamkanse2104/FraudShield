import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class Dispute(Base):
    __tablename__ = "disputes"
    id = Column(String, primary_key=True, default=lambda: "DSP-" + str(uuid.uuid4())[:8].upper())
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=False)
    reason = Column(String(200), nullable=False)   # not_me, wrong_amount, duplicate, other
    description = Column(Text, nullable=True)
    status = Column(Enum("open","under_review","resolved","rejected", name="dispute_status"), default="open")
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    user = relationship("User", backref="disputes")
