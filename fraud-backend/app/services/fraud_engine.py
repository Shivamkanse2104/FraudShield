"""
Fraud Detection Engine
Calculates risk scores based on transaction attributes.
Replace or extend with a real ML model when ready.
"""
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


HIGH_RISK_LOCATIONS = {"us", "uk", "ng", "gh", "ro", "ru", "cn", "kp"}
HIGH_RISK_CATEGORIES = {"crypto", "gaming", "gambling", "adult"}
HIGH_RISK_MERCHANTS  = {"unknown", "unnamed", "test", "anonymous"}


def calculate_risk_score(
    amount: float,
    merchant: str,
    location: str,
    transaction_type: str,
    category: str,
    card_last4: Optional[str],
    user_id: Optional[str] = None,
    db: Optional[Session] = None,
) -> dict:
    """
    Returns: { risk_score, status, reason, breakdown }
    """
    breakdown = []
    score = 0.0

    # ── Amount risk ────────────────────────────────────────────────
    if amount > 100000:
        score += 35
        breakdown.append({"label": "Transaction Amount", "risk": "Critical", "detail": f"₹{amount:,.0f} — extremely high amount"})
    elif amount > 50000:
        score += 25
        breakdown.append({"label": "Transaction Amount", "risk": "High", "detail": f"₹{amount:,.0f} — above threshold"})
    elif amount > 20000:
        score += 15
        breakdown.append({"label": "Transaction Amount", "risk": "Medium", "detail": f"₹{amount:,.0f} — moderate amount"})
    elif amount > 5000:
        score += 8
        breakdown.append({"label": "Transaction Amount", "risk": "Low", "detail": f"₹{amount:,.0f} — normal range"})
    else:
        breakdown.append({"label": "Transaction Amount", "risk": "Low", "detail": f"₹{amount:,.0f} — within safe range"})

    # ── Location risk ─────────────────────────────────────────────
    location_lower = location.lower()
    country_code = location_lower.split(",")[-1].strip()[:2]
    if country_code in HIGH_RISK_LOCATIONS:
        score += 22
        breakdown.append({"label": "Location", "risk": "High", "detail": f"{location} — high-risk region"})
    elif "india" in location_lower or "in" == country_code:
        breakdown.append({"label": "Location", "risk": "Low", "detail": f"{location} — domestic transaction"})
    else:
        score += 10
        breakdown.append({"label": "Location", "risk": "Medium", "detail": f"{location} — foreign transaction"})

    # ── Merchant risk ─────────────────────────────────────────────
    merchant_lower = merchant.lower()
    if any(bad in merchant_lower for bad in HIGH_RISK_MERCHANTS):
        score += 20
        breakdown.append({"label": "Merchant", "risk": "High", "detail": f"Unverified merchant: {merchant}"})
    else:
        breakdown.append({"label": "Merchant", "risk": "Low", "detail": f"{merchant} — recognised merchant"})

    # ── Category risk ─────────────────────────────────────────────
    if category.lower() in HIGH_RISK_CATEGORIES:
        score += 18
        breakdown.append({"label": "Merchant Category", "risk": "High", "detail": f"{category} — elevated risk category"})
    else:
        breakdown.append({"label": "Merchant Category", "risk": "Low", "detail": f"{category} — standard category"})

    # ── Transaction type ──────────────────────────────────────────
    if transaction_type == "ATM":
        score += 12
        breakdown.append({"label": "Transaction Type", "risk": "Medium", "detail": "ATM withdrawal — higher risk"})
    elif transaction_type == "Online":
        score += 5
        breakdown.append({"label": "Transaction Type", "risk": "Low", "detail": "Online transaction — standard"})
    else:
        breakdown.append({"label": "Transaction Type", "risk": "Low", "detail": f"{transaction_type} — in-person"})

    # ── Card verification ─────────────────────────────────────────
    if card_last4:
        breakdown.append({"label": "Card Verification", "risk": "Low", "detail": "Card digits provided"})
    else:
        score += 5
        breakdown.append({"label": "Card Verification", "risk": "Medium", "detail": "No card digits provided"})

    # ── Velocity check (if DB provided) ──────────────────────────
    if db and user_id:
        from app.models.transaction import Transaction
        recent_count = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.created_at >= datetime.utcnow() - timedelta(hours=1)
        ).count()
        if recent_count >= 10:
            score += 20
            breakdown.append({"label": "Velocity", "risk": "High", "detail": f"{recent_count} transactions in last hour"})
        elif recent_count >= 5:
            score += 10
            breakdown.append({"label": "Velocity", "risk": "Medium", "detail": f"{recent_count} transactions in last hour"})

    # ── Cap score ─────────────────────────────────────────────────
    score = min(round(score, 1), 99.0)

    # ── Determine status & reason ─────────────────────────────────
    if score >= 80:
        status = "blocked"
        reason = "Transaction automatically blocked — risk score critical"
    elif score >= 60:
        status = "flagged"
        reason = "Transaction flagged for review — elevated risk score"
    else:
        status = "approved"
        reason = None

    return {
        "risk_score": score,
        "status": status,
        "reason": reason,
        "breakdown": breakdown,
    }
