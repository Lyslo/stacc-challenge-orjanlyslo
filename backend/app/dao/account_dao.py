from typing import List
from app.dao.database import get_db_connection
from app.models.account import Account
import logging

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