from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.models import (User, Transaction, Device, Alert, Rule, Report,
                        Dispute, Case, Watchlist, CardControl, AlertPreference,
                        AuditLog, Session)  # noqa

from app.routers import (auth, users, transactions, devices, alerts,
                         rules, reports, analytics)
from app.routers import (disputes, cases, card_controls,
                         watchlist, audit_log, alert_preferences)

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version="2.0.0", docs_url="/docs")

app.add_middleware(CORSMiddleware, allow_origins=settings.origins_list,
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

for router in [auth.router, users.router, transactions.router, devices.router,
               alerts.router, rules.router, reports.router, analytics.router,
               disputes.router, cases.router, card_controls.router,
               watchlist.router, audit_log.router, alert_preferences.router]:
    app.include_router(router)

@app.get("/")
def root(): return {"message": "Fraud Shield API v2", "docs": "/docs"}

@app.get("/health")
def health(): return {"status": "ok"}
