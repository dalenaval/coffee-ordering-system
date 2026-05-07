from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.system_setting import SystemSetting
from app.schemas.system_control import SystemSettingUpdate

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
def update_system_control(
    setting_id: int,
    payload: SystemSettingUpdate,
    db: Session = Depends(get_db),
):
    setting = db.query(SystemSetting).filter(SystemSetting.id == setting_id).first()

    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found.")

    setting.setting_value = payload.setting_value
    db.commit()
    db.refresh(setting)

    return {
        "message": "System setting updated successfully.",
        "setting": {
            "id": setting.id,
            "setting_key": setting.setting_key,
            "setting_value": setting.setting_value,
            "description": setting.description,
        },
    }


@router.get("/public")
def get_public_system_controls(db: Session = Depends(get_db)):
    rows = db.query(SystemSetting).all()
    settings = {row.setting_key: row.setting_value for row in rows}

    return {
        "store_name": settings.get("store_name", "Kape Nga Ni"),
        "website_ordering": settings.get("website_ordering", "Enabled"),
        "menu_visibility": settings.get("menu_visibility", "Published"),
        "order_acceptance": settings.get("order_acceptance", "Open"),
        "dine_in_enabled": settings.get("dine_in_enabled", "1"),
        "takeout_enabled": settings.get("takeout_enabled", "1"),
        "pickup_enabled": settings.get("pickup_enabled", "1"),
        "cash_enabled": settings.get("cash_enabled", "1"),
        "gcash_enabled": settings.get("gcash_enabled", "1"),
        "card_enabled": settings.get("card_enabled", "1"),
        "opening_time": settings.get("opening_time", "08:00"),
        "closing_time": settings.get("closing_time", "21:00"),
        "tax_rate": settings.get("tax_rate", "0.00"),
        "service_charge": settings.get("service_charge", "0.00"),
    }
