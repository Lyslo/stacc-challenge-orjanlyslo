from typing import List
from app.models.transaction import Transaction
from app.dao.database import get_db_connection

class TransactionDAO:
    @staticmethod
    async def get_transactions_by_account_id(account_id: str) -> List[Transaction]:
        async with get_db_connection() as db:
            query = """
                SELECT id, date, description, amount, currency, account_id
                FROM transactions
                WHERE account_id = $1
                ORDER BY date DESC
            """
            results = await db.fetch(query, account_id)
            return [Transaction(**dict(row)) for row in results] 