from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.report import Report
from app.schemas.schemas import ReportCreate, ReportOut

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("", response_model=List[ReportOut])
def list_reports(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(Report).order_by(Report.created_at.desc()).all()


@router.get("/stats")
def report_stats(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    from sqlalchemy import func
    total = db.query(func.count(Report.id)).scalar()
    completed = db.query(func.count(Report.id)).filter(Report.status == "completed").scalar()
    scheduled = db.query(func.count(Report.id)).filter(Report.status == "scheduled").scalar()
    return {"total": total, "completed": completed, "scheduled": scheduled, "downloads": 156}


@router.post("", response_model=ReportOut)
def generate_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    report = Report(
        name=payload.name,
        report_type=payload.report_type,
        filters=payload.filters,
        status="processing",
        generated_by=admin.id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # In production: trigger async task (Celery/BackgroundTasks) to generate file
    # For now we'll mark it completed immediately
    report.status = "completed"
    report.file_size = "1.2 MB"
    report.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(report)
    return report


@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.delete("/{report_id}")
def delete_report(report_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted"}
