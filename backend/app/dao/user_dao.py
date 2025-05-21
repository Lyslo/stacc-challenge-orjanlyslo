from typing import Optional
from datetime import date
from app.models.user import User
from app.dao.database import get_db_connection

class UserDAO:
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        async with get_db_connection() as db:
            query = """
                SELECT id, username, email, date_of_birth, created_at, updated_at
                FROM users
                WHERE id = $1
            """
            result = await db.fetchrow(query, user_id)
            if result:
                return User(**dict(result))
            return None 