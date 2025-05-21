from typing import List, Dict
from decimal import Decimal
from datetime import datetime, date
from app.dao.analytics_dao import AnalyticsDAO
from app.models.analytics import (
    SpendingInsights,
    SavingsInsights,
    AccountInsights,
    SpendingCategory,
    MonthlySavings,
    AccountDistribution
)

class AnalyticsService:
    @staticmethod
    async def get_spending_insights(user_id: str) -> SpendingInsights:
        # Get spending transactions from DAO
        results = await AnalyticsDAO.get_user_spending_transactions(user_id)
        
        # Calculate insights
        total_spending = sum(Decimal(str(row['amount'])) for row in results)
        avg_transaction = total_spending / len(results) if results else Decimal('0')
        
        # Group by category (using description as a simple category)
        categories = {}
        for row in results:
            category = row['description']
            if category not in categories:
                categories[category] = Decimal('0')
            categories[category] += Decimal(str(row['amount']))
        
        # Get top spending categories
        top_categories = sorted(
            [SpendingCategory(category=k, amount=abs(float(v))) for k, v in categories.items()],
            key=lambda x: x.amount,
            reverse=True
        )[:5]

        return SpendingInsights(
            total_spending=float(total_spending),
            average_transaction=float(avg_transaction),
            transaction_count=len(results),
            top_spending_categories=top_categories
        )

    @staticmethod
    async def get_savings_insights(user_id: str) -> SavingsInsights:
        # Get savings transactions from DAO
        results = await AnalyticsDAO.get_user_savings_transactions(user_id)
        
        # Calculate insights
        total_savings = sum(Decimal(str(row['amount'])) for row in results if row['amount'] > 0)
        total_withdrawals = sum(Decimal(str(row['amount'])) for row in results if row['amount'] < 0)
        net_savings = total_savings + total_withdrawals  # withdrawals are already negative
        
        # Get monthly savings trend
        monthly_savings = {}
        for row in results:
            if row['amount'] > 0:  # Only count deposits
                month = row['date'].strftime('%Y-%m')
                if month not in monthly_savings:
                    monthly_savings[month] = Decimal('0')
                monthly_savings[month] += Decimal(str(row['amount']))

        return SavingsInsights(
            total_savings=float(total_savings),
            total_withdrawals=float(total_withdrawals),
            net_savings=float(net_savings),
            monthly_savings=[
                MonthlySavings(month=k, amount=float(v))
                for k, v in sorted(monthly_savings.items())
            ]
        )

    @staticmethod
    async def get_account_insights(user_id: str) -> AccountInsights:
        # Get accounts from DAO
        results = await AnalyticsDAO.get_user_accounts(user_id)
        
        # Calculate insights
        total_balance = sum(Decimal(str(row['balance'])) for row in results)
        account_distribution = [
            AccountDistribution(
                account_type=row['account_type'],
                balance=float(row['balance']),
                percentage=float(Decimal(str(row['balance'])) / total_balance * 100)
            )
            for row in results
        ]

        return AccountInsights(
            total_balance=float(total_balance),
            account_count=len(results),
            account_distribution=account_distribution
        ) 