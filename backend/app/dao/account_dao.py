from typing import List
from app.models.account import Account
import logging
from app.dao.database import get_db_connection
from uuid import UUID

class AccountDAO:
    @staticmethod
    async def get_accounts_by_user_id(user_id: UUID) -> List[Account]:
        async with get_db_connection() as db:
            query = """
                SELECT id, account_number, account_type, balance, currency, user_id, created_at, updated_at
                FROM accounts
                WHERE user_id = $1
                ORDER BY created_at DESC
            """
            results = await db.fetch(query, user_id)
            return [Account(**dict(row)) for row in results] 