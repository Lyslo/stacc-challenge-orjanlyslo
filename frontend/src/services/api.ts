import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

export interface User {
  id: string;  // UUID will be received as string from API
  username: string;
  email: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  account_id: string;
  created_at: string;
}

export interface SpendingInsights {
  total_spending: number;
  average_transaction: number;
  transaction_count: number;
  top_spending_categories: Array<{
    category: string;
    amount: number;
  }>;
}

export interface SavingsInsights {
  total_savings: number;
  total_withdrawals: number;
  net_savings: number;
  monthly_savings: Array<{
    month: string;
    amount: number;
  }>;
}

export interface AccountInsights {
  total_balance: number;
  account_count: number;
  account_distribution: Array<{
    account_type: string;
    balance: number;
    percentage: number;
  }>;
}

export interface SavingsGoalMilestone {
  id: number;
  savings_goal_id: number;
  description: string;
  target_amount: number;
  xp_reward: number;
  completed: boolean;
}

export interface SavingsGoal {
  id: number;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon_type: string;
  completed: boolean;
  xp_reward: number;
  milestones: SavingsGoalMilestone[];
}

export interface SavingsGoalCreate {
  name: string;
  target_amount: number;
  current_amount: number;
  icon_type: string;
}

export const api = {
  getUser: async (userId: string) => {
    console.log('API: Getting user:', userId);
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    console.log('API: User response:', response.data);
    return response.data;
  },

  getUserAccounts: async (userId: string): Promise<Account[]> => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/accounts`);
    return response.data;
  },

  getAccountTransactions: async (accountId: string): Promise<Transaction[]> => {
    const response = await axios.get(`${API_BASE_URL}/accounts/${accountId}/transactions`);
    return response.data;
  },

  getSpendingInsights: async (userId: string): Promise<SpendingInsights> => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/analytics/spending`);
    return response.data;
  },

  getSavingsInsights: async (userId: string): Promise<SavingsInsights> => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/analytics/savings`);
    return response.data;
  },

  getAccountInsights: async (userId: string): Promise<AccountInsights> => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/analytics/accounts`);
    return response.data;
  },

  getUserSavingsGoals: async (userId: string): Promise<SavingsGoal[]> => {
    console.log('API: Getting savings goals for user:', userId);
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/savings-goals`);
    console.log('API: Savings goals response:', response.data);
    return response.data;
  },

  createSavingsGoal: async (userId: string, goal: SavingsGoalCreate): Promise<SavingsGoal> => {
    console.log('API: Creating savings goal for user:', userId, goal);
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/savings-goals`, {
      name: goal.name,
      target_amount: Number(goal.target_amount),
      current_amount: Number(goal.current_amount),
      icon_type: goal.icon_type
    });
    console.log('API: Create savings goal response:', response.data);
    return response.data;
  },

  deleteSavingsGoal: async (goalId: number): Promise<void> => {
    console.log('API: Deleting savings goal:', goalId);
    await axios.delete(`${API_BASE_URL}/savings-goals/${goalId}`);
    console.log('API: Savings goal deleted successfully');
  }
}; 