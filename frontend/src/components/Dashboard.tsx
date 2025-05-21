import React, { useState, useEffect } from 'react';
import Analytics from './Analytics';
import { api, User } from '../services/api';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'analytics' | 'gamification'>('analytics');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Using Alice's UUID from the database
        const userId = '8c3721fd-d83b-4cc4-814b-dec42a4914e4';
        console.log('Fetching user data for ID:', userId);
        const userData = await api.getUser(userId);
        console.log('Received user data:', userData);
        setUser(userData);
      } catch (err) {
        console.error('Detailed error:', err);
        if (axios.isAxiosError(err)) {
          setError(`Failed to load user data: ${err.message} (${err.response?.status})`);
        } else {
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Hi {user?.username}, welcome to your financial dashboard
        </h1>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveSection('analytics')}
              className={`${
                activeSection === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveSection('gamification')}
              className={`${
                activeSection === 'gamification'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            >
              Savings Game
            </button>
          </nav>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {activeSection === 'analytics' ? (
            <Analytics userId={user?.id} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
              <p className="text-gray-600">The gamified savings experience is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 