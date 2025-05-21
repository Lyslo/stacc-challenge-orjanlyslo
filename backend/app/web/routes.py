from fastapi import APIRouter, Depends
from .health_routes import router as health_router
from app.services.account_service import AccountService
from typing import List
from app.models.account import Account

router = APIRouter()

# Include all route modules here
router.include_router(health_router)

# Add a simple ping endpoint
@router.get("/ping")
async def ping():
    return {"message": "pong"}

@router.get("/accounts/owner/{owner}", response_model=List[Account])
async def get_accounts_by_owner(owner: str, account_service: AccountService = Depends()):
    return await account_service.get_accounts_by_owner(owner) 