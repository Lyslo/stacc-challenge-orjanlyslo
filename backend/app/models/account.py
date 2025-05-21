from pydantic import BaseModel
from decimal import Decimal

class Account(BaseModel):
    id: str
    account_number: str
    account_type: str
    balance: Decimal
    currency: str
    owner: str 