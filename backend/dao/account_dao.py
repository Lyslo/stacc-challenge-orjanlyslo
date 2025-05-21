from typing import List
from database import get_db_connection
from models.account import Account

class AccountDAO:
    async def get_accounts_by_owner(self, owner: str) -> List[Account]:
        query = """
            SELECT id, account_number, account_type, balance, currency, owner
            FROM accounts
            WHERE owner = %s
        """
        async with get_db_connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (owner,))
                rows = await cur.fetchall()
                return [
                    Account(
                        id=row[0],
                        account_number=row[1],
                        account_type=row[2],
                        balance=row[3],
                        currency=row[4],
                        owner=row[5]
                    )
                    for row in rows
                ] 