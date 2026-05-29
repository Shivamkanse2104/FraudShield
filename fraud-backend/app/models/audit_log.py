import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String, ForeignKey("users.id"), nullable=True)   # who did it
    actor_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)    # e.g. "block_transaction", "update_rule"
    resource_type = Column(String(50), nullable=True)   # transaction, user, rule ...
    resource_id = Column(String(100), nullable=True)
    detail = Column(Text, nullable=True)            # JSON or human-readable detail
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
