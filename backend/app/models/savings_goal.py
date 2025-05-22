from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID

class SavingsGoalMilestone(BaseModel):
    id: int
    goal_id: int
    target_amount: float
    xp_reward: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SavingsGoal(BaseModel):
    id: int
    user_id: UUID
    name: str
    target_amount: float
    current_amount: float
    icon_type: str
    created_at: datetime
    updated_at: datetime
    milestones: List[SavingsGoalMilestone] = []

    class Config:
        from_attributes = True

class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float
    icon_type: str 