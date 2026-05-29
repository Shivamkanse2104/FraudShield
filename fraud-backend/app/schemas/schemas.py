from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ─── User ────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    role: str
    status: str
    tier: str
    risk_score: float
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    tier: Optional[str] = None
    risk_score: Optional[float] = None

class UserSummary(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str
    risk_score: float
    created_at: datetime
    transaction_count: int = 0
    blocked_count: int = 0

    class Config:
        from_attributes = True


# ─── Transaction ─────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    amount: float
    merchant: str
    category: str = "Retail"
    location: str
    card_last4: Optional[str] = None
    transaction_type: str = "Online"

class TransactionOut(BaseModel):
    id: str
    user_id: str
    amount: float
    merchant: str
    category: str
    location: str
    card_last4: Optional[str]
    transaction_type: str
    status: str
    risk_score: float
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionStatusUpdate(BaseModel):
    status: str   # approved | flagged | blocked


# ─── Device ──────────────────────────────────────────────────────────────────

class DeviceCreate(BaseModel):
    name: str
    device_type: str = "Mobile"
    os: Optional[str] = None
    location: Optional[str] = None

class DeviceOut(BaseModel):
    id: str
    user_id: str
    name: str
    device_type: str
    os: Optional[str]
    location: Optional[str]
    trusted: bool
    last_used: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class DeviceTrustUpdate(BaseModel):
    trusted: bool


# ─── Alert ───────────────────────────────────────────────────────────────────

class AlertOut(BaseModel):
    id: str
    user_id: Optional[str]
    transaction_id: Optional[str]
    alert_type: str
    priority: str
    title: str
    description: Optional[str]
    risk_score: float
    amount: Optional[float]
    status: str
    resolution: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    resolution: Optional[str] = None
    notes: Optional[str] = None


# ─── Rule ────────────────────────────────────────────────────────────────────

class RuleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "transaction"
    action: str = "flag"
    priority: str = "medium"
    condition_field: Optional[str] = None
    condition_operator: Optional[str] = None
    condition_value: Optional[str] = None
    condition_display: Optional[str] = None
    risk_weight: float = 50.0

class RuleOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    category: str
    action: str
    priority: str
    condition_display: Optional[str]
    risk_weight: float
    active: bool
    trigger_count: int
    created_at: datetime
    last_triggered: Optional[datetime]

    class Config:
        from_attributes = True

class RuleToggle(BaseModel):
    active: bool


# ─── Report ──────────────────────────────────────────────────────────────────

class ReportCreate(BaseModel):
    name: str
    report_type: str = "Fraud Analysis"
    filters: Optional[str] = None

class ReportOut(BaseModel):
    id: str
    name: str
    report_type: str
    status: str
    file_size: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── Analytics ───────────────────────────────────────────────────────────────

class AnalyticsOut(BaseModel):
    detection_accuracy: float
    false_positive_rate: float
    fraud_prevented_amount: float
    avg_response_time_ms: float
    total_transactions: int
    total_flagged: int
    total_blocked: int
    total_users: int
    trend_data: List[dict]
    risk_distribution: List[dict]
    fraud_type_distribution: List[dict]


# ─── Fraud Check ─────────────────────────────────────────────────────────────

class FraudCheckRequest(BaseModel):
    amount: float
    merchant: str
    location: str
    card_last4: Optional[str] = None
    transaction_type: str = "Online"
    category: str = "Retail"

class FraudCheckResponse(BaseModel):
    risk_score: float
    status: str   # approved | flagged | blocked
    reason: Optional[str]
    breakdown: List[dict]
    transaction_id: Optional[str] = None
