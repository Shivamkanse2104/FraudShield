from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.dispute import Dispute
from app.models.transaction import Transaction

router = APIRouter(prefix="/api/disputes", tags=["disputes"])

class DisputeCreate(BaseModel):
    transaction_id: str
    reason: str
    description: Optional[str] = None

class DisputeUpdate(BaseModel):
    status: Optional[str] = None
    resolution: Optional[str] = None

@router.get("")
def list_disputes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    q = db.query(Dispute)
    if current_user.role == "user":
        q = q.filter(Dispute.user_id == current_user.id)
    return q.order_by(Dispute.created_at.desc()).all()

@router.post("")
def create_dispute(payload: DisputeCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == payload.transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if current_user.role == "user" and tx.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    tx.disputed = True
    dispute = Dispute(
        user_id=current_user.id,
        transaction_id=payload.transaction_id,
        reason=payload.reason,
        description=payload.description,
    )
    db.add(dispute)
    db.commit()
    db.refresh(dispute)
    return dispute

@router.put("/{dispute_id}")
def update_dispute(dispute_id: str, payload: DisputeUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    if payload.status:
        dispute.status = payload.status
        if payload.status in ("resolved", "rejected"):
            dispute.resolved_at = datetime.utcnow()
    if payload.resolution:
        dispute.resolution = payload.resolution
    db.commit()
    db.refresh(dispute)
    return dispute
