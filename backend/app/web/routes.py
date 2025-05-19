from fastapi import APIRouter
from .health_routes import router as health_router

router = APIRouter()

# Include all route modules here
router.include_router(health_router)

# Add a simple ping endpoint
@router.get("/ping")
async def ping():
    return {"message": "pong"} 