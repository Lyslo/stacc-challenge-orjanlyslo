from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.savings_goal import SavingsGoal, SavingsGoalMilestone
from app.dao.database import get_db

class SavingsGoalDAO:
    def __init__(self):
        self.db = next(get_db())

    async def get_goals_by_user_id(self, user_id: str) -> List[SavingsGoal]:
        # Get total savings for the user
        total_savings = self.db.execute(
            text("""
                SELECT COALESCE(SUM(amount), 0) as total
                FROM transactions
                WHERE account_id IN (
                    SELECT id FROM accounts WHERE user_id = :user_id AND account_type = 'Savings'
                )
            """),
            {"user_id": user_id}
        ).scalar()

        goals = self.db.execute(
            text("SELECT * FROM savings_goals WHERE user_id = :user_id"),
            {"user_id": user_id}
        ).mappings().all()

        result = []
        for goal in goals:
            goal_dict = dict(goal)
            # Convert title to name to match the Pydantic model
            goal_dict['name'] = goal_dict.pop('title')
            
            # Update completion status
            is_completed = total_savings >= goal_dict['target_amount']
            if is_completed != goal_dict['completed']:
                self.db.execute(
                    text("""
                        UPDATE savings_goals 
                        SET completed = :completed, 
                            updated_at = CURRENT_TIMESTAMP 
                        WHERE id = :goal_id
                    """),
                    {
                        "completed": is_completed,
                        "goal_id": goal_dict['id']
                    }
                )
                goal_dict['completed'] = is_completed
            
            # Get milestones for this goal
            milestones = self.db.execute(
                text("SELECT * FROM savings_goal_milestones WHERE goal_id = :goal_id"),
                {"goal_id": goal_dict['id']}
            ).mappings().all()
            
            # Convert milestones to model instances and update their completion status
            goal_dict['milestones'] = []
            for m in milestones:
                milestone_completed = total_savings >= m['amount']
                if milestone_completed != m['completed']:
                    self.db.execute(
                        text("""
                            UPDATE savings_goal_milestones 
                            SET completed = :completed, 
                                updated_at = CURRENT_TIMESTAMP 
                            WHERE id = :milestone_id
                        """),
                        {
                            "completed": milestone_completed,
                            "milestone_id": m['id']
                        }
                    )
                
                goal_dict['milestones'].append(
                    SavingsGoalMilestone(
                        id=m['id'],
                        goal_id=m['goal_id'],
                        target_amount=float(m['amount']),
                        xp_reward=m['xp_reward'],
                        completed=milestone_completed,
                        created_at=m['created_at'],
                        updated_at=m['updated_at']
                    )
                )
            
            result.append(SavingsGoal(**goal_dict))
        
        self.db.commit()
        return result

    async def create_goal(self, user_id: str, goal_data: dict) -> SavingsGoal:
        # Calculate XP reward based on target amount
        target_amount = float(goal_data["target_amount"])
        xp_reward = min(int(target_amount / 1000), 2000)  # Cap at 2000 XP

        # Insert the goal
        result = self.db.execute(
            text("""
                INSERT INTO savings_goals (user_id, title, target_amount, current_amount, icon_type, xp_reward)
                VALUES (:user_id, :title, :target_amount, :current_amount, :icon_type, :xp_reward)
                RETURNING *
            """),
            {
                "user_id": user_id,
                "title": goal_data["name"],
                "target_amount": goal_data["target_amount"],
                "current_amount": goal_data["current_amount"],
                "icon_type": goal_data["icon_type"],
                "xp_reward": xp_reward
            }
        ).mappings().first()
        
        self.db.commit()
        
        # Create milestones
        milestone_amounts = [target_amount * 0.25, target_amount * 0.5, target_amount * 0.75, target_amount]
        xp_rewards = [50, 100, 150, 200]
        
        for amount, xp in zip(milestone_amounts, xp_rewards):
            self.db.execute(
                text("""
                    INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
                    VALUES (:goal_id, :amount, :xp_reward, false)
                """),
                {
                    "goal_id": result['id'],
                    "amount": amount,
                    "xp_reward": xp
                }
            )
        
        self.db.commit()
        
        # Get the newly created goal with its milestones
        goal_dict = dict(result)
        goal_dict['name'] = goal_dict.pop('title')
        
        # Get milestones for this goal
        milestones = self.db.execute(
            text("SELECT * FROM savings_goal_milestones WHERE goal_id = :goal_id"),
            {"goal_id": goal_dict['id']}
        ).mappings().all()
        
        # Convert milestones to model instances
        goal_dict['milestones'] = [
            SavingsGoalMilestone(
                id=m['id'],
                goal_id=m['goal_id'],
                target_amount=float(m['amount']),
                xp_reward=m['xp_reward'],
                completed=m['completed'],
                created_at=m['created_at'],
                updated_at=m['updated_at']
            ) for m in milestones
        ]
        
        return SavingsGoal(**goal_dict)

    async def delete_goal(self, goal_id: int) -> bool:
        # First check if the goal exists
        result = self.db.execute(
            text("SELECT id FROM savings_goals WHERE id = :goal_id"),
            {"goal_id": goal_id}
        ).mappings().first()
        
        if not result:
            return False
            
        # Delete the goal
        self.db.execute(
            text("DELETE FROM savings_goals WHERE id = :goal_id"),
            {"goal_id": goal_id}
        )
        self.db.commit()
        return True 