from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID

class Account(BaseModel):
    id: str  # Account IDs are in format like 'acc789'
    account_number: str
    account_type: str
    balance: Decimal
    currency: str
    user_id: UUID  # User IDs are UUIDs
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AccountCreate(BaseModel):
    account_number: str
    account_type: str
    balance: float
    currency: str
    user_id: UUID 