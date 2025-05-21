from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Transaction(BaseModel):
    id: str
    date: datetime
    description: str
    amount: float
    currency: str
    account_id: str
    created_at: datetime

class TransactionCreate(BaseModel):
    date: datetime
    description: str
    amount: float
    currency: str
    account_id: str 