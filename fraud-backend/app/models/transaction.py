import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=lambda: "TXN-" + str(uuid.uuid4())[:8].upper())
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    merchant = Column(String(200), nullable=False)
    category = Column(String(100), default="Retail")
    location = Column(String(200), nullable=False)
    card_last4 = Column(String(4), nullable=True)
    payment_method = Column(String(50), default="card")
    transaction_type = Column(String(50), default="Online")
    status = Column(Enum("approved","flagged","blocked","pending", name="tx_status"), default="pending")
    risk_score = Column(Float, default=0.0)
    reason = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    annotated_as = Column(String(50), nullable=True)   # verified | suspicious | null
    disputed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    user = relationship("User", back_populates="transactions")
