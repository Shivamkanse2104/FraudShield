import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum, Boolean, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(Enum("super_admin","admin","analyst","manager","auditor","user", name="user_role"), default="user", nullable=False)
    status = Column(Enum("active","flagged","suspended", name="user_status"), default="active")
    tier = Column(Enum("gold","silver","bronze", name="user_tier"), default="bronze")
    risk_score = Column(Float, default=0.0)
    security_score = Column(Integer, default=50)      # 0-100 gamified score
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(64), nullable=True)    # TOTP secret (encrypted in prod)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    devices = relationship("Device", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user")
