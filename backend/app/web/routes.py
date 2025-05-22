from fastapi import APIRouter, Depends, HTTPException
from .health_routes import router as health_router
from app.services.account_service import AccountService
from app.services.analytics_service import AnalyticsService
from app.services.savings_goal_service import SavingsGoalService
from typing import List, Dict
from app.models.account import Account
from app.models.user import User
from app.models.transaction import Transaction
from app.models.analytics import SpendingInsights, SavingsInsights, AccountInsights
from app.models.savings_goal import SavingsGoal, SavingsGoalCreate
from app.services.user_service import UserService
from app.services.transaction_service import TransactionService

router = APIRouter()
user_service = UserService()
account_service = AccountService()
transaction_service = TransactionService()
analytics_service = AnalyticsService()
savings_goal_service = SavingsGoalService()

# Include all route modules here
router.include_router(health_router)

# simple ping endpoint
@router.get("/ping")
async def ping():
    return {"message": "pong"}

@router.get("/accounts/owner/{owner}", response_model=List[Account])
async def get_accounts_by_owner(owner: str, account_service: AccountService = Depends()):
    return await account_service.get_accounts_by_owner(owner)

@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/{user_id}/accounts", response_model=List[Account])
async def get_user_accounts(user_id: str):
    # First verify user exists
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    accounts = await account_service.get_accounts_by_user_id(user_id)
    return accounts

@router.get("/accounts/{account_id}/transactions", response_model=List[Transaction])
async def get_account_transactions(account_id: str):
    transactions = await transaction_service.get_transactions_by_account_id(account_id)
    return transactions

# Analytics endpoints
@router.get("/users/{user_id}/analytics/spending", response_model=SpendingInsights)
async def get_spending_insights(user_id: str):
    # First verify user exists
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    insights = await analytics_service.get_spending_insights(user_id)
    return insights.model_dump()

@router.get("/users/{user_id}/analytics/savings", response_model=SavingsInsights)
async def get_savings_insights(user_id: str):
    # First verify user exists
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    insights = await analytics_service.get_savings_insights(user_id)
    return insights.model_dump()

@router.get("/users/{user_id}/analytics/accounts", response_model=AccountInsights)
async def get_account_insights(user_id: str):
    # First verify user exists
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    insights = await analytics_service.get_account_insights(user_id)
    return insights.model_dump()

# Savings Goals endpoints
@router.get("/users/{user_id}/savings-goals", response_model=List[SavingsGoal])
async def get_user_savings_goals(user_id: str):
    # First verify user exists
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    goals = await savings_goal_service.get_goals_by_user_id(user_id)
    return goals

@router.post("/users/{user_id}/savings-goals", response_model=SavingsGoal)
async def create_savings_goal(user_id: str, goal: SavingsGoalCreate):
    # First verify user exists
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create the goal with the user_id from the path parameter
    goal_data = goal.model_dump()
    goal_data["user_id"] = user_id
    
    return await savings_goal_service.create_goal(goal_data)

@router.delete("/savings-goals/{goal_id}")
async def delete_savings_goal(goal_id: int):
    success = await savings_goal_service.delete_goal(goal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return {"message": "Savings goal deleted successfully"} 