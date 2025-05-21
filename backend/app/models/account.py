from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from decimal import Decimal

class Account(BaseModel):
    id: str
    account_number: str
    account_type: str
    balance: float
    currency: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class AccountCreate(BaseModel):
    account_number: str
    account_type: str
    balance: float
    currency: str
    user_id: str

class Account(BaseModel):
    id: str
    account_number: str
    account_type: str
    balance: Decimal
    currency: str
    owner: str 