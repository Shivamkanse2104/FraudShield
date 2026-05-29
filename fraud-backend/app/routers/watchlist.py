from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.watchlist import Watchlist

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

class WatchlistCreate(BaseModel):
    user_id: str
    reason: str
    level: str = "monitor"
    notes: Optional[str] = None

@router.get("")
def list_watchlist(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(Watchlist).filter(Watchlist.active == "true").all()

@router.post("")
def add_to_watchlist(payload: WatchlistCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    entry = Watchlist(**payload.model_dump(), added_by=admin.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
def remove_from_watchlist(entry_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    entry = db.query(Watchlist).filter(Watchlist.id == entry_id).first()
    if not entry: raise HTTPException(status_code=404, detail="Entry not found")
    entry.active = "false"
    db.commit()
    return {"message": "Removed from watchlist"}
