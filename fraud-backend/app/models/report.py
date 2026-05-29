import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Text
from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=lambda: "RPT-" + str(uuid.uuid4())[:8].upper())
    name = Column(String(300), nullable=False)
    report_type = Column(String(100), default="Fraud Analysis")
    status = Column(String(50), default="processing")   # processing, completed, scheduled
    file_size = Column(String(20), nullable=True)
    file_path = Column(String(500), nullable=True)
    filters = Column(Text, nullable=True)               # JSON string of filters used
    generated_by = Column(String, nullable=True)        # user_id
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
