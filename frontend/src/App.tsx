import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  owner: string;
}

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [owners, setOwners] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch unique owners from the accounts
    const fetchOwners = async () => {
      try {
        const response = await axios.get<Account[]>('http://localhost:5001/accounts/owner/Alice');
        const uniqueOwners = Array.from(new Set(response.data.map((account) => account.owner)));
        setOwners(uniqueOwners);
        if (uniqueOwners.length > 0) {
          setSelectedOwner(uniqueOwners[0]);
        }
      } catch (err) {
        setError('Failed to fetch owners');
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedOwner) return;
      
      try {
        const response = await axios.get<Account[]>(`http://localhost:5001/accounts/owner/${selectedOwner}`);
        setAccounts(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch accounts');
      }
    };

    fetchAccounts();
  }, [selectedOwner]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">Budgeting and Savings 💰</h1>
                <p className="text-center text-gray-600 mb-4">
                  Making saving money fun and engaging!
                </p>
                
                <div className="mb-6">
                  <label htmlFor="owner-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    id="owner-select"
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {owners.map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="text-red-600 mb-4">{error}</div>
                )}

                <div className="grid gap-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{account.account_type}</h3>
                          <p className="text-gray-600">{account.account_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {account.balance.toLocaleString()} {account.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 