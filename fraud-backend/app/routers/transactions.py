from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.transaction import Transaction
from app.models.alert import Alert
from app.schemas.schemas import TransactionCreate, TransactionOut, TransactionStatusUpdate, FraudCheckRequest, FraudCheckResponse
from app.services.fraud_engine import calculate_risk_score

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=List[TransactionOut])
def list_transactions(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(Transaction)
    # Non-admins only see their own transactions
    if current_user.role != "admin":
        q = q.filter(Transaction.user_id == current_user.id)
    if status and status != "all":
        q = q.filter(Transaction.status == status)
    if search:
        q = q.filter(
            (Transaction.merchant.ilike(f"%{search}%")) |
            (Transaction.id.ilike(f"%{search}%"))
        )
    return q.order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/stats")
def transaction_stats(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    total = db.query(func.count(Transaction.id)).scalar()
    total_amount = db.query(func.sum(Transaction.amount)).scalar() or 0
    flagged = db.query(func.count(Transaction.id)).filter(Transaction.status == "flagged").scalar()
    blocked = db.query(func.count(Transaction.id)).filter(Transaction.status == "blocked").scalar()
    return {"total": total, "total_amount": total_amount, "flagged": flagged, "blocked": blocked}


@router.post("/check", response_model=FraudCheckResponse)
def check_transaction(
    payload: FraudCheckRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Manual fraud check — also saves transaction to user history."""
    result = calculate_risk_score(
        amount=payload.amount,
        merchant=payload.merchant,
        location=payload.location,
        transaction_type=payload.transaction_type,
        category=payload.category,
        card_last4=payload.card_last4,
        user_id=current_user.id,
        db=db,
    )

    # Save the transaction
    tx = Transaction(
        user_id=current_user.id,
        amount=payload.amount,
        merchant=payload.merchant,
        category=payload.category,
        location=payload.location,
        card_last4=payload.card_last4,
        transaction_type=payload.transaction_type,
        status=result["status"],
        risk_score=result["risk_score"],
        reason=result["reason"],
    )
    db.add(tx)

    # Auto-create alert if high risk
    if result["risk_score"] >= 80:
        alert = Alert(
            user_id=current_user.id,
            transaction_id=tx.id,
            alert_type="transaction",
            priority="critical",
            title=f"High-Risk Transaction Detected",
            description=f"Transaction of ₹{payload.amount:,.0f} at {payload.merchant} scored {result['risk_score']}%",
            risk_score=result["risk_score"],
            amount=payload.amount,
        )
        db.add(alert)
    elif result["risk_score"] >= 60:
        alert = Alert(
            user_id=current_user.id,
            transaction_id=tx.id,
            alert_type="transaction",
            priority="high",
            title="Suspicious Transaction Flagged",
            description=f"Transaction of ₹{payload.amount:,.0f} at {payload.merchant} requires review",
            risk_score=result["risk_score"],
            amount=payload.amount,
        )
        db.add(alert)

    db.commit()
    db.refresh(tx)

    return FraudCheckResponse(
        risk_score=result["risk_score"],
        status=result["status"],
        reason=result["reason"],
        breakdown=result["breakdown"],
        transaction_id=tx.id,
    )


@router.get("/{tx_id}", response_model=TransactionOut)
def get_transaction(tx_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if current_user.role != "admin" and tx.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return tx


@router.put("/{tx_id}/status")
def update_transaction_status(
    tx_id: str,
    payload: TransactionStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if payload.status not in ("approved", "flagged", "blocked"):
        raise HTTPException(status_code=400, detail="Invalid status")
    tx.status = payload.status
    db.commit()
    return {"id": tx_id, "status": payload.status}
