from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.alert_preference import AlertPreference

router = APIRouter(prefix="/api/alert-preferences", tags=["alert-preferences"])

class PreferenceUpdate(BaseModel):
    email_alerts: Optional[bool] = None
    sms_alerts: Optional[bool] = None
    push_alerts: Optional[bool] = None
    threshold_amount: Optional[float] = None
    alert_on_foreign: Optional[bool] = None
    alert_on_new_device: Optional[bool] = None
    alert_on_large_tx: Optional[bool] = None
    alert_on_blocked: Optional[bool] = None
    min_risk_score: Optional[float] = None

def _get_or_create(user_id, db):
    pref = db.query(AlertPreference).filter(AlertPreference.user_id == user_id).first()
    if not pref:
        pref = AlertPreference(user_id=user_id)
        db.add(pref); db.commit(); db.refresh(pref)
    return pref

@router.get("")
def get_preferences(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return _get_or_create(current_user.id, db)

@router.put("")
def update_preferences(payload: PreferenceUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    pref = _get_or_create(current_user.id, db)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(pref, field, value)
    db.commit(); db.refresh(pref)
    return pref
