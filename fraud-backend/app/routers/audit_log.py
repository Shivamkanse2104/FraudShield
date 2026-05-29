from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/api/audit-log", tags=["audit"])

class AuditCreate(BaseModel):
    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    detail: Optional[str] = None

@router.get("")
def list_audit_log(
    resource_type: Optional[str] = Query(None),
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db), _admin=Depends(get_current_admin),
):
    q = db.query(AuditLog)
    if resource_type: q = q.filter(AuditLog.resource_type == resource_type)
    return q.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()

@router.post("")
def create_log(payload: AuditCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    log = AuditLog(actor_id=admin.id, actor_role=admin.role, **payload.model_dump())
    db.add(log)
    db.commit()
    return {"message": "Logged"}
