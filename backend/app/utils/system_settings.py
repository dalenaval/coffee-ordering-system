from sqlalchemy.orm import Session
from app.models.system_setting import SystemSetting


def get_system_settings_map(db: Session) -> dict:
    rows = db.query(SystemSetting).all()
    return {row.setting_key: row.setting_value for row in rows}
