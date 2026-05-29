from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.alert import Alert
from app.schemas.schemas import AlertOut, AlertUpdate

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=List[AlertOut])
def list_alerts(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    q = db.query(Alert)
    if status and status != "all":
        q = q.filter(Alert.status == status)
    if priority and priority != "all":
        q = q.filter(Alert.priority == priority)
    return q.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/stats")
def alert_stats(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    total = db.query(func.count(Alert.id)).filter(Alert.status != "resolved").scalar()
    critical = db.query(func.count(Alert.id)).filter(Alert.priority == "critical", Alert.status != "resolved").scalar()
    high = db.query(func.count(Alert.id)).filter(Alert.priority == "high", Alert.status != "resolved").scalar()
    medium = db.query(func.count(Alert.id)).filter(Alert.priority == "medium", Alert.status != "resolved").scalar()
    resolved = db.query(func.count(Alert.id)).filter(Alert.status == "resolved").scalar()
    total_all = db.query(func.count(Alert.id)).scalar()
    resolution_rate = round((resolved / total_all * 100) if total_all else 0, 1)
    return {
        "active": total, "critical": critical, "high": high,
        "medium": medium, "resolution_rate": resolution_rate,
    }


@router.get("/{alert_id}", response_model=AlertOut)
def get_alert(alert_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.put("/{alert_id}", response_model=AlertOut)
def update_alert(
    alert_id: str,
    payload: AlertUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    if payload.status:
        alert.status = payload.status
        if payload.status == "resolved":
            alert.resolved_at = datetime.utcnow()
    if payload.resolution:
        alert.resolution = payload.resolution
    if payload.notes:
        alert.notes = payload.notes
    db.commit()
    db.refresh(alert)
    return alert


@router.delete("/{alert_id}")
def delete_alert(alert_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted"}
