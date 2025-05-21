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
  }
}; 