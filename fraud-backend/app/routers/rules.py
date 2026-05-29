from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.rule import Rule
from app.schemas.schemas import RuleCreate, RuleOut, RuleToggle

router = APIRouter(prefix="/api/rules", tags=["rules"])


@router.get("", response_model=List[RuleOut])
def list_rules(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(Rule).order_by(Rule.created_at.desc()).all()


@router.get("/stats")
def rule_stats(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    total = db.query(func.count(Rule.id)).scalar()
    active = db.query(func.count(Rule.id)).filter(Rule.active == True).scalar()
    total_triggers = db.query(func.sum(Rule.trigger_count)).scalar() or 0
    return {"total": total, "active": active, "total_triggers": int(total_triggers)}


@router.post("", response_model=RuleOut)
def create_rule(payload: RuleCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    rule = Rule(**payload.model_dump())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


@router.put("/{rule_id}", response_model=RuleOut)
def update_rule(rule_id: str, payload: RuleCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(rule, field, value)
    db.commit()
    db.refresh(rule)
    return rule


@router.patch("/{rule_id}/toggle", response_model=RuleOut)
def toggle_rule(rule_id: str, payload: RuleToggle, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    rule.active = payload.active
    db.commit()
    db.refresh(rule)
    return rule


@router.delete("/{rule_id}")
def delete_rule(rule_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(rule)
    db.commit()
    return {"message": "Rule deleted"}
