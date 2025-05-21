from typing import List, Dict
from decimal import Decimal
from datetime import datetime, date
from app.dao.database import get_db_connection

class AnalyticsDAO:
    @staticmethod
    async def get_user_transactions(user_id: str) -> List[Dict]:
        async with get_db_connection() as db:
            query = """
                SELECT t.*, a.account_type
                FROM transactions t
                JOIN accounts a ON t.account_id = a.id
                WHERE a.user_id = $1
                ORDER BY t.date DESC
            """
            return await db.fetch(query, user_id)

    @staticmethod
    async def get_user_spending_transactions(user_id: str) -> List[Dict]:
        async with get_db_connection() as db:
            query = """
                SELECT t.*, a.account_type
                FROM transactions t
                JOIN accounts a ON t.account_id = a.id
                WHERE a.user_id = $1
                AND t.amount < 0
                ORDER BY t.date DESC
            """
            return await db.fetch(query, user_id)

    @staticmethod
    async def get_user_savings_transactions(user_id: str) -> List[Dict]:
        async with get_db_connection() as db:
            query = """
                SELECT t.*, a.account_type
                FROM transactions t
                JOIN accounts a ON t.account_id = a.id
                WHERE a.user_id = $1
                AND (
                    t.description LIKE '%Savings%'
                    OR t.description LIKE '%Interest%'
                    OR t.description LIKE '%Pension%'
                )
                ORDER BY t.date DESC
            """
            return await db.fetch(query, user_id)

    @staticmethod
    async def get_user_accounts(user_id: str) -> List[Dict]:
        async with get_db_connection() as db:
            query = """
                SELECT id, account_type, balance, currency
                FROM accounts
                WHERE user_id = $1
            """
            return await db.fetch(query, user_id) 