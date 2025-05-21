from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from decimal import Decimal

class Transaction(BaseModel):
    id: str
    date: datetime
    description: str
    amount: Decimal
    currency: str
    account_id: str

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    date: datetime
    description: str
    amount: float
    currency: str
    account_id: str 