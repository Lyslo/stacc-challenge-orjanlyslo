import React, { useState } from 'react';

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  owner: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  account_id: string;
}

const Analytics: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accounts] = useState<Account[]>([
    {
      id: 'acc123',
      account_number: '********1234',
      account_type: 'Checking',
      balance: 15000.25,
      currency: 'NOK',
      owner: 'Alice'
    },
    {
      id: 'acc456',
      account_number: '********5678',
      account_type: 'Savings',
      balance: 25000.75,
      currency: 'NOK',
      owner: 'Alice'
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn001',
      date: '2023-08-15',
      description: 'Grocery Store',
      amount: -75.50,
      currency: 'NOK',
      account_id: 'acc123'
    },
    {
      id: 'txn002',
      date: '2023-08-14',
      description: 'Paycheck Deposit',
      amount: 2500.00,
      currency: 'NOK',
      account_id: 'acc123'
    }
  ]);

  const filteredTransactions = selectedAccount
    ? transactions.filter(t => t.account_id === selectedAccount)
    : [];

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
                  {filteredTransactions.map((transaction) => (
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