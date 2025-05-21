from typing import List
from models.account import Account
from dao.account_dao import AccountDAO

class AccountService:
    def __init__(self):
        self.account_dao = AccountDAO()

    async def get_accounts_by_owner(self, owner: str) -> List[Account]:
        # Here we can add business logic in the future
        # For now, we just delegate to the DAO
        return await self.account_dao.get_accounts_by_owner(owner) 