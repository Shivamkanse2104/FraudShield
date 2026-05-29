from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.case import Case

router = APIRouter(prefix="/api/cases", tags=["cases"])

class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    fraud_type: Optional[str] = None
    risk_score: float = 0.0
    alert_id: Optional[str] = None
    transaction_id: Optional[str] = None
    user_id: Optional[str] = None

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    resolution: Optional[str] = None

@router.get("/stats")
def case_stats(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    total = db.query(func.count(Case.id)).scalar() or 0
    open_c = db.query(func.count(Case.id)).filter(Case.status == "open").scalar() or 0
    in_progress = db.query(func.count(Case.id)).filter(Case.status == "in_progress").scalar() or 0
    critical = db.query(func.count(Case.id)).filter(Case.priority == "critical", Case.status != "closed").scalar() or 0
    resolved = db.query(func.count(Case.id)).filter(Case.status.in_(["resolved","closed"])).scalar() or 0
    avg_risk = db.query(func.avg(Case.risk_score)).scalar() or 0
    return {"total": total, "open": open_c, "in_progress": in_progress, "critical": critical, "resolved": resolved, "avg_risk": round(avg_risk, 1)}

@router.get("")
def list_cases(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    skip: int = 0, limit: int = 50,
    db: Session = Depends(get_db), _admin=Depends(get_current_admin),
):
    q = db.query(Case)
    if status and status != "all": q = q.filter(Case.status == status)
    if priority and priority != "all": q = q.filter(Case.priority == priority)
    return q.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()

@router.post("")
def create_case(payload: CaseCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    sla = datetime.utcnow() + timedelta(hours={"critical":2,"high":8,"medium":24,"low":72}.get(payload.priority, 24))
    case = Case(**payload.model_dump(), sla_deadline=sla)
    db.add(case)
    db.commit()
    db.refresh(case)
    return case

@router.get("/{case_id}")
def get_case(case_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case: raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.put("/{case_id}")
def update_case(case_id: str, payload: CaseUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case: raise HTTPException(status_code=404, detail="Case not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(case, field, value)
    if payload.status in ("resolved","closed"):
        case.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(case)
    return case
