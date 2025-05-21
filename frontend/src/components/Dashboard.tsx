import React, { useState } from 'react';
import Analytics from './Analytics';

const Dashboard: React.FC = () => {
  const username = "Alice"; // Hardcoded for now since we only have Alice in the database
  const [activeSection, setActiveSection] = useState<'analytics' | 'gamification'>('analytics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Hi {username}, welcome to your financial dashboard
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
            <Analytics />
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