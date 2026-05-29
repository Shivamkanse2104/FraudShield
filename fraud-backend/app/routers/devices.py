from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.device import Device
from app.schemas.schemas import DeviceCreate, DeviceOut, DeviceTrustUpdate

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.get("", response_model=List[DeviceOut])
def list_devices(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(Device)
    if current_user.role != "admin":
        q = q.filter(Device.user_id == current_user.id)
    return q.order_by(Device.last_used.desc()).all()


@router.post("", response_model=DeviceOut)
def add_device(
    payload: DeviceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    device = Device(
        user_id=current_user.id,
        name=payload.name,
        device_type=payload.device_type,
        os=payload.os,
        location=payload.location,
        trusted=True,
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


@router.put("/{device_id}/trust")
def update_device_trust(
    device_id: str,
    payload: DeviceTrustUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    if current_user.role != "admin" and device.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    device.trusted = payload.trusted
    db.commit()
    return {"id": device_id, "trusted": payload.trusted}


@router.delete("/{device_id}")
def delete_device(
    device_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    if current_user.role != "admin" and device.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(device)
    db.commit()
    return {"message": "Device removed"}
