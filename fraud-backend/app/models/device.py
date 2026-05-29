import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, default=lambda: "DEV-" + str(uuid.uuid4())[:8].upper())
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    device_type = Column(String(50), default="Mobile")   # Mobile, Laptop, Desktop, Tablet
    os = Column(String(100), nullable=True)
    location = Column(String(200), nullable=True)
    ip_address = Column(String(45), nullable=True)
    fingerprint = Column(String(255), nullable=True, unique=True)
    trusted = Column(Boolean, default=True)
    last_used = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="devices")
