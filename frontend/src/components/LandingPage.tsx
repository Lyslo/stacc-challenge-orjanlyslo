import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard'); // We'll create this route later
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-5">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
        Budgeting and Savings 💰
      </h1>
      <h2 className="text-2xl text-gray-600 mb-8 text-center">
        Making saving money fun and engaging!
      </h2>
      <button
        onClick={handleGetStarted}
        className="px-8 py-4 text-xl bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage; 