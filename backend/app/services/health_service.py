from app.models.health import HealthResponse

class HealthService:
    @staticmethod
    def get_health_status() -> HealthResponse:
        return HealthResponse(
            status="healthy",
            version="1.0.0"
        ) 