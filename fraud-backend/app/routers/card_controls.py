from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.card_control import CardControl

router = APIRouter(prefix="/api/card-controls", tags=["card-controls"])

class CardControlUpdate(BaseModel):
    card_frozen: Optional[bool] = None
    daily_limit: Optional[float] = None
    per_transaction_limit: Optional[float] = None
    international_blocked: Optional[bool] = None
    online_blocked: Optional[bool] = None
    atm_blocked: Optional[bool] = None
    travel_mode: Optional[bool] = None
    travel_countries: Optional[str] = None
    travel_start: Optional[datetime] = None
    travel_end: Optional[datetime] = None
    quick_block: Optional[bool] = None

def _get_or_create(user_id: str, db: Session) -> CardControl:
    ctrl = db.query(CardControl).filter(CardControl.user_id == user_id).first()
    if not ctrl:
        ctrl = CardControl(user_id=user_id)
        db.add(ctrl)
        db.commit()
        db.refresh(ctrl)
    return ctrl

@router.get("")
def get_controls(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return _get_or_create(current_user.id, db)

@router.put("")
def update_controls(payload: CardControlUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl = _get_or_create(current_user.id, db)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(ctrl, field, value)
    db.commit()
    db.refresh(ctrl)
    return ctrl

@router.post("/quick-block")
def quick_block(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl = _get_or_create(current_user.id, db)
    ctrl.quick_block = True
    ctrl.card_frozen = True
    db.commit()
    return {"message": "All transactions blocked. Contact support to unblock."}
