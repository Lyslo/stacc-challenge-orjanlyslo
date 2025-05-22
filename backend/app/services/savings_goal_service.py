from typing import List
from app.models.savings_goal import SavingsGoal, SavingsGoalCreate
from app.dao.savings_goal_dao import SavingsGoalDAO
from uuid import UUID

class SavingsGoalService:
    def __init__(self):
        self.savings_goal_dao = SavingsGoalDAO()

    async def get_goals_by_user_id(self, user_id: UUID) -> List[SavingsGoal]:
        return await self.savings_goal_dao.get_goals_by_user_id(user_id)

    async def create_goal(self, goal_data: dict) -> SavingsGoal:
        # Calculate XP reward based on target amount
        target_amount = float(goal_data["target_amount"])
        xp_reward = min(int(target_amount / 1000), 2000)  # Cap at 2000 XP
        
        # Create goal with the provided data
        return await self.savings_goal_dao.create_goal(goal_data["user_id"], goal_data)

    async def delete_goal(self, goal_id: int) -> bool:
        return await self.savings_goal_dao.delete_goal(goal_id) 