from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.user import User
from app.models.transaction import Transaction
from app.models.device import Device
from app.schemas.schemas import UserOut, UserUpdate, UserSummary

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[UserSummary])
def list_users(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    q = db.query(User)
    if search:
        q = q.filter((User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")))
    if status and status != "all":
        q = q.filter(User.status == status)
    users = q.offset(skip).limit(limit).all()

    result = []
    for u in users:
        tx_count = db.query(func.count(Transaction.id)).filter(Transaction.user_id == u.id).scalar()
        blocked = db.query(func.count(Transaction.id)).filter(
            Transaction.user_id == u.id, Transaction.status == "blocked"
        ).scalar()
        result.append(UserSummary(
            id=u.id, name=u.name, email=u.email, role=u.role,
            status=u.status, risk_score=u.risk_score, created_at=u.created_at,
            transaction_count=tx_count, blocked_count=blocked,
        ))
    return result


@router.get("/stats")
def user_stats(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    total = db.query(func.count(User.id)).scalar()
    active = db.query(func.count(User.id)).filter(User.status == "active").scalar()
    flagged = db.query(func.count(User.id)).filter(User.status == "flagged").scalar()
    suspended = db.query(func.count(User.id)).filter(User.status == "suspended").scalar()
    return {"total": total, "active": active, "flagged": flagged, "suspended": suspended}


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Users can only access their own profile; admins can access any
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}/details")
def get_user_details(user_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.created_at.desc()).limit(10).all()
    devices = db.query(Device).filter(Device.user_id == user_id).all()
    tx_count = db.query(func.count(Transaction.id)).filter(Transaction.user_id == user_id).scalar()
    flagged_count = db.query(func.count(Transaction.id)).filter(Transaction.user_id == user_id, Transaction.status == "flagged").scalar()
    blocked_count = db.query(func.count(Transaction.id)).filter(Transaction.user_id == user_id, Transaction.status == "blocked").scalar()

    return {
        "user": {
            "id": user.id, "name": user.name, "email": user.email,
            "phone": user.phone, "role": user.role, "status": user.status,
            "tier": user.tier, "risk_score": user.risk_score, "created_at": user.created_at,
        },
        "stats": {
            "total_transactions": tx_count,
            "flagged_transactions": flagged_count,
            "blocked_transactions": blocked_count,
            "active_devices": len(devices),
        },
        "recent_transactions": [
            {"id": t.id, "amount": t.amount, "merchant": t.merchant,
             "status": t.status, "risk_score": t.risk_score, "created_at": t.created_at}
            for t in transactions
        ],
        "devices": [
            {"id": d.id, "name": d.name, "device_type": d.device_type,
             "os": d.os, "trusted": d.trusted, "last_used": d.last_used, "location": d.location}
            for d in devices
        ],
    }


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: str, payload: UserUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
