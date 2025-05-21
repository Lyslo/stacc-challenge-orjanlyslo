import React, { useState, useEffect } from 'react';
import { api, Account, Transaction } from '../services/api';

interface AnalyticsProps {
  userId?: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ userId }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const accountsData = await api.getUserAccounts(userId);
        setAccounts(accountsData);
        if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0].id);
        }
      } catch (err) {
        setError('Failed to load accounts');
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedAccount) return;

      try {
        const transactionsData = await api.getAccountTransactions(selectedAccount);
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load transactions');
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, [selectedAccount]);

  if (!userId) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">Please log in to view your accounts</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">Loading accounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Accounts</h2>
      
      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${
              selectedAccount === account.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white hover:shadow-xl'
            }`}
            onClick={() => setSelectedAccount(account.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{account.account_type}</h3>
                <p className="text-gray-600">{account.account_number}</p>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {account.balance.toLocaleString()} {account.currency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      {selectedAccount && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount.toLocaleString()} {transaction.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics; 