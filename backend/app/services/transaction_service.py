from typing import List
from app.models.transaction import Transaction
from app.dao.transaction_dao import TransactionDAO

class TransactionService:
    def __init__(self):
        self.transaction_dao = TransactionDAO()

    async def get_transactions_by_account_id(self, account_id: str) -> List[Transaction]:
        return await self.transaction_dao.get_transactions_by_account_id(account_id) 