from pydantic import BaseModel

class SystemSettingUpdate(BaseModel):
    setting_value: str

class PublicSystemSettingsResponse(BaseModel):
    store_name: str
    website_ordering: str
    menu_visibility: str
    order_acceptance: str
    dine_in_enabled: str
    takeout_enabled: str
    pickup_enabled: str
    cash_enabled: str
    gcash_enabled: str
    card_enabled: str
    opening_time: str
    closing_time: str
    tax_rate: str
    service_charge: str
