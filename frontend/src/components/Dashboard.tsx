import React, { useEffect, useState } from 'react';
import { api, User, Account, Transaction } from '../services/api';
import Analytics from './Analytics';
import LevelUp from './LevelUp';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Using Alice's UUID for the showcase application
        const userData = await api.getUser('8c3721fd-d83b-4cc4-814b-dec42a4914e4');
        setUser(userData);
        setError(null);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;

      try {
        const accountsData = await api.getUserAccounts(user.id);
        setAccounts(accountsData);
        if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0].id);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    fetchAccounts();
  }, [user]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedAccount) return;

      try {
        const transactionsData = await api.getAccountTransactions(selectedAccount);
        setTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, [selectedAccount]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.username || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your financial status
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <nav className="flex space-x-1 p-1" aria-label="Tabs">
            {['Accounts', 'Insights', 'Level Up'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => handleTabChange(index)}
                className={`
                  w-full py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200
                  ${activeTab === index
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Accounts Tab */}
          {activeTab === 0 && (
            <div className="space-y-6">
              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`
                      p-4 rounded-lg transition-all duration-200 cursor-pointer
                      ${selectedAccount === account.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{account.account_type}</h3>
                        <p className="text-sm text-gray-500 mt-1">{account.account_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions Section */}
              {selectedAccount && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                              <td className={`px-4 py-3 text-sm text-right font-medium ${
                                transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(transaction.amount)}
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
          )}

          {/* Insights Tab */}
          {activeTab === 1 && user && <Analytics userId={user.id} />}

          {/* Level Up Tab */}
          {activeTab === 2 && user && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <LevelUp userId={user.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 