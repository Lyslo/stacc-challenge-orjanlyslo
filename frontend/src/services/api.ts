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

export const api = {
  async getUser(userId: string): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  },

  async getUserAccounts(userId: string): Promise<Account[]> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/accounts`);
    return response.data;
  },

  async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    const response = await axios.get(`${API_BASE_URL}/accounts/${accountId}/transactions`);
    return response.data;
  },

  async getSpendingInsights(userId: string): Promise<SpendingInsights> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/analytics/spending`);
    return response.data;
  },

  async getSavingsInsights(userId: string): Promise<SavingsInsights> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/analytics/savings`);
    return response.data;
  },

  async getAccountInsights(userId: string): Promise<AccountInsights> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/analytics/accounts`);
    return response.data;
  }
}; 