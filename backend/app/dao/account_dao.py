from typing import List
from app.models.account import Account
import logging
from app.dao.database import get_db_connection

class AccountDAO:
    async def get_accounts_by_owner(self, owner: str) -> List[Account]:
        query = """
            SELECT id, account_number, account_type, balance, currency, owner
            FROM accounts
            WHERE owner = $1
        """
        logging.info(f"Executing query for owner: {owner}")
        try:
            async with get_db_connection() as conn:
                rows = await conn.fetch(query, owner)
                logging.info(f"Found {len(rows)} accounts for owner {owner}")
                return [
                    Account(
                        id=row['id'],
                        account_number=row['account_number'],
                        account_type=row['account_type'],
                        balance=row['balance'],
                        currency=row['currency'],
                        owner=row['owner']
                    )
                    for row in rows
                ]
        except Exception as e:
            logging.error(f"Error fetching accounts: {str(e)}")
            raise

    @staticmethod
    async def get_accounts_by_user_id(user_id: str) -> List[Account]:
        async with get_db_connection() as db:
            query = """
                SELECT id, account_number, account_type, balance, currency, user_id, created_at, updated_at
                FROM accounts
                WHERE user_id = $1
                ORDER BY created_at DESC
            """
            results = await db.fetch(query, user_id)
            return [Account(**dict(row)) for row in results] 