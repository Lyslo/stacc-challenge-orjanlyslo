from fastapi import APIRouter
from app.services.health_service import HealthService

router = APIRouter()

@router.get("/health")
async def health_check():
    return HealthService.get_health_status() 