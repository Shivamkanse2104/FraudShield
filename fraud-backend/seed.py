"""
Run this once to populate the database with demo data.
Usage: python seed.py
"""
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
import random
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base
from app.models import User, Transaction, Device, Alert, Rule, Report
from app.core.security import hash_password

# Import all models so SQLAlchemy knows about every table
try:
    from app.models.dispute import Dispute
    from app.models.case import Case
    from app.models.watchlist import Watchlist
    from app.models.card_control import CardControl
    from app.models.alert_preference import AlertPreference
    from app.models.audit_log import AuditLog
    from app.models.session import Session as UserSession
except ImportError:
    pass  # older version without these models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def clear_all():
    """Wipe all tables in one shot using CASCADE — handles all FK constraints."""
    # Get all table names from metadata, truncate everything
    db.execute(text("DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE'; END LOOP; END $$;"))
    db.commit()

def seed():
    print("🌱 Seeding database...")
    clear_all()

    # ── Admin user ─────────────────────────────────────────────────────────
    admin = User(
        id="admin-001",
        name="Admin User",
        email="admin@fraud.com",
        hashed_password=hash_password("admin123"),
        role="admin",
        status="active",
        tier="gold",
        risk_score=0.0,
        phone="+91 99999 00000",
    )
    db.add(admin)

    # ── Demo user ──────────────────────────────────────────────────────────
    demo_user = User(
        id="user-001",
        name="John Doe",
        email="user@fraud.com",
        hashed_password=hash_password("user123"),
        role="user",
        status="active",
        tier="gold",
        risk_score=28.0,
        phone="+91 98765 43210",
    )
    db.add(demo_user)

    # ── Extra users ────────────────────────────────────────────────────────
    extra_users = [
        User(id="user-002", name="Jane Smith",     email="jane@example.com",   hashed_password=hash_password("pass123"), role="user", status="active",    tier="silver", risk_score=8.0),
        User(id="user-003", name="Mike Johnson",   email="mike@example.com",   hashed_password=hash_password("pass123"), role="user", status="flagged",   tier="silver", risk_score=78.0),
        User(id="user-004", name="Sarah Williams", email="sarah@example.com",  hashed_password=hash_password("pass123"), role="user", status="active",    tier="bronze", risk_score=15.0),
        User(id="user-005", name="Robert Brown",   email="robert@example.com", hashed_password=hash_password("pass123"), role="user", status="suspended", tier="bronze", risk_score=92.0),
        User(id="user-006", name="Emily Davis",    email="emily@example.com",  hashed_password=hash_password("pass123"), role="user", status="active",    tier="gold",   risk_score=6.0),
        User(id="user-007", name="David Miller",   email="david@example.com",  hashed_password=hash_password("pass123"), role="user", status="flagged",   tier="silver", risk_score=65.0),
        User(id="user-008", name="Lisa Anderson",  email="lisa@example.com",   hashed_password=hash_password("pass123"), role="user", status="active",    tier="bronze", risk_score=10.0),
    ]
    db.add_all(extra_users)
    db.commit()

    # ── Transactions for demo user ─────────────────────────────────────────
    demo_transactions = [
        Transaction(id="TXN-001", user_id="user-001", amount=2500,  merchant="Amazon India",    category="Retail",      location="Mumbai, India", card_last4="3847", transaction_type="Online",  status="approved", risk_score=15.0, created_at=datetime.utcnow() - timedelta(days=1)),
        Transaction(id="TXN-002", user_id="user-001", amount=15000, merchant="Flipkart",         category="Electronics", location="Delhi, India",  card_last4="2941", transaction_type="Online",  status="approved", risk_score=22.0, created_at=datetime.utcnow() - timedelta(days=2)),
        Transaction(id="TXN-003", user_id="user-001", amount=8500,  merchant="Swiggy",           category="Food",        location="Mumbai, India", card_last4="5623", transaction_type="Online",  status="flagged",  risk_score=65.0, reason="Unusual spending pattern",        created_at=datetime.utcnow() - timedelta(days=3)),
        Transaction(id="TXN-004", user_id="user-001", amount=45000, merchant="Unknown Merchant", category="Retail",      location="New York, US",  card_last4="7834", transaction_type="Online",  status="blocked",  risk_score=92.0, reason="Suspicious merchant + location",  created_at=datetime.utcnow() - timedelta(days=4)),
    ]
    db.add_all(demo_transactions)

    # ── Transactions for other users ───────────────────────────────────────
    merchants  = ["Amazon", "Starbucks", "Best Buy", "Target", "Walmart", "Flipkart", "Zomato", "Swiggy"]
    locations  = ["Mumbai, India", "Delhi, India", "Bangalore, India", "Chennai, India", "New York, US", "London, UK"]
    categories = ["Retail", "Food", "Electronics", "Travel", "Healthcare"]

    for user in extra_users:
        for _ in range(random.randint(3, 20)):
            risk = random.uniform(5, 95)
            status = "blocked" if risk >= 80 else "flagged" if risk >= 60 else "approved"
            db.add(Transaction(
                user_id=user.id,
                amount=round(random.uniform(200, 80000), 2),
                merchant=random.choice(merchants),
                category=random.choice(categories),
                location=random.choice(locations),
                card_last4=str(random.randint(1000, 9999)),
                transaction_type=random.choice(["Online", "In-store", "ATM"]),
                status=status,
                risk_score=round(risk, 1),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            ))
    db.commit()

    # ── Devices for demo user ──────────────────────────────────────────────
    demo_devices = [
        Device(id="DEV-001", user_id="user-001", name="iPhone 14 Pro",  device_type="Mobile",  os="iOS 17.2",     location="Mumbai, India", trusted=True,  last_used=datetime.utcnow() - timedelta(hours=2)),
        Device(id="DEV-002", user_id="user-001", name="MacBook Pro",    device_type="Laptop",  os="macOS Sonoma", location="Mumbai, India", trusted=True,  last_used=datetime.utcnow() - timedelta(days=1)),
        Device(id="DEV-003", user_id="user-001", name="Chrome Browser", device_type="Desktop", os="Windows 11",   location="Delhi, India",  trusted=False, last_used=datetime.utcnow() - timedelta(days=3)),
    ]
    db.add_all(demo_devices)

    # ── Alerts ─────────────────────────────────────────────────────────────
    alerts = [
        Alert(id="ALT-001", user_id="user-005", transaction_id="TXN-004", alert_type="transaction", priority="high",   title="Multiple high-risk transactions detected",  description="5 transactions from same IP in 10 minutes",      risk_score=88.0, amount=45000, status="new",          created_at=datetime.utcnow() - timedelta(minutes=2)),
        Alert(id="ALT-002", user_id="user-003",                            alert_type="velocity",    priority="medium", title="Card velocity threshold exceeded",           description="Card ****3847 used 8 times in last hour",         risk_score=72.0, amount=21000, status="new",          created_at=datetime.utcnow() - timedelta(minutes=8)),
        Alert(id="ALT-003", user_id="user-005",                            alert_type="location",    priority="high",   title="Impossible travel pattern",                  description="Card used in NY and CA within 30 minutes",       risk_score=92.0, amount=15000, status="investigating", created_at=datetime.utcnow() - timedelta(minutes=15)),
        Alert(id="ALT-004", user_id="user-007",                            alert_type="pattern",     priority="medium", title="Unusual purchase pattern",                   description="First international transaction for this account", risk_score=61.0, amount=8500,  status="new",          created_at=datetime.utcnow() - timedelta(minutes=23)),
        Alert(id="ALT-005", user_id="user-002",                            alert_type="device",      priority="low",    title="New device login detected",                  description="Login from unrecognised device in Berlin",        risk_score=35.0,              status="resolved",     created_at=datetime.utcnow() - timedelta(hours=1), resolved_at=datetime.utcnow() - timedelta(minutes=30)),
    ]
    db.add_all(alerts)

    # ── Fraud detection rules ──────────────────────────────────────────────
    rules = [
        Rule(id="RUL-001", name="High Velocity Transactions",  description="Blocks users making more than 10 transactions in 5 minutes", category="velocity",   action="block",  priority="high",   condition_display="transactions > 10 in 5 minutes",        risk_weight=90.0, active=True,  trigger_count=234, last_triggered=datetime.utcnow() - timedelta(hours=2)),
        Rule(id="RUL-002", name="Large Transaction Amount",    description="Flags transactions over ₹10,000",                            category="amount",     action="flag",   priority="medium", condition_display="amount > ₹10,000",                       risk_weight=60.0, active=True,  trigger_count=89,  last_triggered=None),
        Rule(id="RUL-003", name="Suspicious Location Change",  description="Detects rapid geographic location changes",                  category="location",   action="block",  priority="high",   condition_display="location change > 500 miles in 1 hour",  risk_weight=85.0, active=True,  trigger_count=156, last_triggered=datetime.utcnow() - timedelta(hours=1)),
        Rule(id="RUL-004", name="Failed Login Attempts",       description="Blocks account after 5 failed login attempts",               category="pattern",    action="block",  priority="high",   condition_display="failed_logins > 5 in 10 minutes",        risk_weight=80.0, active=True,  trigger_count=67,  last_triggered=datetime.utcnow() - timedelta(minutes=30)),
        Rule(id="RUL-005", name="New Device Detection",        description="Requires verification for new device logins",                category="device",     action="review", priority="medium", condition_display="device not recognised",                   risk_weight=50.0, active=True,  trigger_count=342, last_triggered=datetime.utcnow() - timedelta(minutes=5)),
        Rule(id="RUL-006", name="Unusual Transaction Pattern", description="Detects transactions outside normal user behavior",          category="behavioral", action="flag",   priority="low",    condition_display="deviation > 3 standard deviations",      risk_weight=40.0, active=False, trigger_count=45,  last_triggered=datetime.utcnow() - timedelta(hours=3)),
    ]
    db.add_all(rules)

    # ── Reports ────────────────────────────────────────────────────────────
    reports = [
        Report(id="RPT-001", name="Monthly Fraud Analysis Report", report_type="Fraud Analysis", status="completed", file_size="2.4 MB", generated_by="admin-001", created_at=datetime.utcnow() - timedelta(days=17), completed_at=datetime.utcnow() - timedelta(days=17)),
        Report(id="RPT-002", name="Transaction Volume Report",      report_type="Transactions",   status="completed", file_size="1.8 MB", generated_by="admin-001", created_at=datetime.utcnow() - timedelta(days=7),  completed_at=datetime.utcnow() - timedelta(days=7)),
        Report(id="RPT-003", name="User Activity Summary",          report_type="Users",          status="completed", file_size="890 KB", generated_by="admin-001", created_at=datetime.utcnow() - timedelta(days=5),  completed_at=datetime.utcnow() - timedelta(days=5)),
        Report(id="RPT-004", name="Risk Score Distribution",        report_type="Analytics",      status="processing",                    generated_by="admin-001", created_at=datetime.utcnow() - timedelta(days=3)),
        Report(id="RPT-005", name="Weekly Performance Metrics",     report_type="Performance",    status="scheduled",                     generated_by="admin-001", created_at=datetime.utcnow() - timedelta(days=2)),
    ]
    db.add_all(reports)

    db.commit()
    db.close()
    print("✅ Database seeded successfully!")
    print("\n📋 Demo credentials:")
    print("   Admin → admin@fraud.com / admin123")
    print("   User  → user@fraud.com  / user123")

if __name__ == "__main__":
    seed()
