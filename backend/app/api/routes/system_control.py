from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.system_setting import SystemSetting

router = APIRouter(prefix="/system-control", tags=["System Control"])

@router.get("/")
def get_system_controls(db: Session = Depends(get_db)):
    rows = db.query(SystemSetting).order_by(SystemSetting.id.asc()).all()
    return [
        {
            "id": row.id,
            "setting_key": row.setting_key,
            "setting_value": row.setting_value,
            "description": row.description,
        }
        for row in rows
    ]


@router.put("/{setting_id}")
def update_system_control(setting_id: int, payload: dict, db: Session = Depends(get_db)):
    setting = db.query(SystemSetting).filter(SystemSetting.id == setting_id).first()
    if not setting:
      raise HTTPException(status_code=404, detail="Setting not found.")

    setting.setting_value = str(payload.get("setting_value", setting.setting_value))
    db.commit()
    db.refresh(setting)

    return {
        "message": "System setting updated successfully.",
        "setting": {
            "id": setting.id,
            "setting_key": setting.setting_key,
            "setting_value": setting.setting_value,
        }
    }