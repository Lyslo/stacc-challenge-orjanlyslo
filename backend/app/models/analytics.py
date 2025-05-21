from typing import List, Optional
from pydantic import BaseModel
from decimal import Decimal

class SpendingCategory(BaseModel):
    category: str
    amount: float

class SpendingInsights(BaseModel):
    total_spending: float
    average_transaction: float
    transaction_count: int
    top_spending_categories: List[SpendingCategory]

class MonthlySavings(BaseModel):
    month: str
    amount: float

class SavingsInsights(BaseModel):
    total_savings: float
    total_withdrawals: float
    net_savings: float
    monthly_savings: List[MonthlySavings]

class AccountDistribution(BaseModel):
    account_type: str
    balance: float
    percentage: float

class AccountInsights(BaseModel):
    total_balance: float
    account_count: int
    account_distribution: List[AccountDistribution] 