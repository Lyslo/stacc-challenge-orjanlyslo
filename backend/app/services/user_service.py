from typing import Optional
from app.models.user import User
from app.dao.user_dao import UserDAO

class UserService:
    def __init__(self):
        self.user_dao = UserDAO()

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        return await self.user_dao.get_user_by_id(user_id) 