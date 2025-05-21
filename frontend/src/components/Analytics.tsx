import React, { useEffect, useState } from 'react';
import { api, SpendingInsights, SavingsInsights, AccountInsights } from '../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Analytics: React.FC<{ userId: string }> = ({ userId }) => {
  const [spendingInsights, setSpendingInsights] = useState<SpendingInsights | null>(null);
  const [savingsInsights, setSavingsInsights] = useState<SavingsInsights | null>(null);
  const [accountInsights, setAccountInsights] = useState<AccountInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const [spending, savings, accounts] = await Promise.all([
          api.getSpendingInsights(userId),
          api.getSavingsInsights(userId),
          api.getAccountInsights(userId),
        ]);
        setSpendingInsights(spending);
        setSavingsInsights(savings);
        setAccountInsights(accounts);
        setError(null);
      } catch (err) {
        setError('Failed to load insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Spending Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Spending Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Spending</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(spendingInsights?.total_spending || 0)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Average Transaction</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(spendingInsights?.average_transaction || 0)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Transaction Count</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {spendingInsights?.transaction_count || 0}
            </p>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spendingInsights?.top_spending_categories || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="category"
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Savings Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Total Savings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(savingsInsights?.total_savings || 0)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Withdrawals</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(savingsInsights?.total_withdrawals || 0)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Net Savings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(savingsInsights?.net_savings || 0)}
            </p>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={savingsInsights?.monthly_savings || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Account Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountInsights?.account_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="percentage"
                >
                  {(accountInsights?.account_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(accountInsights?.total_balance || 0)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Number of Accounts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {accountInsights?.account_count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 