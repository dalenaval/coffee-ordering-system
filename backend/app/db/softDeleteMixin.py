from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, func 
from sqlalchemy.orm import Mapped, mapped_column


class SoftDeleteMixin:
    deleted_at : Mapped[Optional[datetime] | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True, server_default=func.now())

    def soft_delete(self):
        self.deleted_at = datetime.now(timezone.utc)

    def restore(self):
        self.deleted_at = None