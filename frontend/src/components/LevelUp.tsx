import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

interface SavingsGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  xpReward: number;
  completed: boolean;
  bossIcon: React.ReactNode;
  milestones: {
    amount: number;
    xpReward: number;
    completed: boolean;
  }[];
}

interface Milestone {
  amount: number;
  xpReward: number;
  completed: boolean;
}

// Character SVG for different levels
const CharacterIcon: React.FC<{ level: number }> = ({ level }) => {
  const colors = {
    1: '#4B5563', // gray-600
    2: '#3B82F6', // blue-500
    3: '#10B981', // green-500
    4: '#8B5CF6', // purple-500
    5: '#F59E0B', // amber-500
  };
  
  const color = colors[level as keyof typeof colors] || colors[1];
  
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <circle cx="48" cy="48" r="40" fill={color} />
      {/* Face */}
      <circle cx="36" cy="40" r="4" fill="white" />
      <circle cx="60" cy="40" r="4" fill="white" />
      <path
        d="M36 56C36 56 42 64 48 64C54 64 60 56 60 56"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Level indicator */}
      <circle cx="48" cy="24" r="12" fill="white" />
      <text
        x="48"
        y="28"
        textAnchor="middle"
        fill={color}
        fontSize="16"
        fontWeight="bold"
      >
        {level}
      </text>
    </svg>
  );
};

// Boss Icons
const BossIcons = {
  generic: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8Z" fill="#6B7280"/>
      <path d="M32 16C23.163 16 16 23.163 16 32C16 40.837 23.163 48 32 48C40.837 48 48 40.837 48 32C48 23.163 40.837 16 32 16Z" fill="#9CA3AF"/>
      <path d="M32 24C27.582 24 24 27.582 24 32C24 36.418 27.582 40 32 40C36.418 40 40 36.418 40 32C40 27.582 36.418 24 32 24Z" fill="#6B7280"/>
      <path d="M32 28L36 36H28L32 28Z" fill="white"/>
    </svg>
  ),
  house: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L8 24V56H24V40H40V56H56V24L32 8Z" fill="#3B82F6"/>
      <path d="M32 16L16 28V48H24V36H40V48H48V28L32 16Z" fill="#93C5FD"/>
      <path d="M32 24L24 32V48H40V32L32 24Z" fill="#3B82F6"/>
    </svg>
  ),
  car: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M56 40H8V32L16 24H48L56 32V40Z" fill="#EF4444"/>
      <path d="M16 40C16 44.4183 19.5817 48 24 48C28.4183 48 32 44.4183 32 40H16Z" fill="#1F2937"/>
      <path d="M32 40C32 44.4183 35.5817 48 40 48C44.4183 48 48 44.4183 48 40H32Z" fill="#1F2937"/>
      <path d="M16 32H48V36H16V32Z" fill="#FCA5A5"/>
    </svg>
  ),
  retirement: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8Z" fill="#10B981"/>
      <path d="M32 16C23.163 16 16 23.163 16 32C16 40.837 23.163 48 32 48C40.837 48 48 40.837 48 32C48 23.163 40.837 16 32 16Z" fill="#6EE7B7"/>
      <path d="M32 24C27.582 24 24 27.582 24 32C24 36.418 27.582 40 32 40C36.418 40 40 36.418 40 32C40 27.582 36.418 24 32 24Z" fill="#10B981"/>
      <path d="M32 28L36 36H28L32 28Z" fill="white"/>
    </svg>
  ),
  education: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L8 20L32 32L56 20L32 8Z" fill="#8B5CF6"/>
      <path d="M8 44V32L32 44L56 32V44L32 56L8 44Z" fill="#A78BFA"/>
      <path d="M32 32L32 44" stroke="white" strokeWidth="4"/>
    </svg>
  ),
};

const initialGoals: SavingsGoal[] = [
  {
    id: '1',
    title: 'Dream House',
    description: 'Save for your dream house',
    targetAmount: 2000000,
    currentAmount: 0,
    xpReward: 1000,
    completed: false,
    bossIcon: BossIcons.house,
    milestones: [
      { amount: 200000, xpReward: 100, completed: false },
      { amount: 500000, xpReward: 250, completed: false },
      { amount: 1000000, xpReward: 400, completed: false },
      { amount: 2000000, xpReward: 1000, completed: false }
    ]
  },
  {
    id: '2',
    title: 'New Car',
    description: 'Save for a new car',
    targetAmount: 300000,
    currentAmount: 0,
    xpReward: 500,
    completed: false,
    bossIcon: BossIcons.car,
    milestones: [
      { amount: 50000, xpReward: 100, completed: false },
      { amount: 150000, xpReward: 200, completed: false },
      { amount: 300000, xpReward: 500, completed: false }
    ]
  },
  {
    id: '3',
    title: 'Early Retirement',
    description: 'Build your retirement fund',
    targetAmount: 5000000,
    currentAmount: 0,
    xpReward: 2000,
    completed: false,
    bossIcon: BossIcons.retirement,
    milestones: [
      { amount: 500000, xpReward: 200, completed: false },
      { amount: 1500000, xpReward: 500, completed: false },
      { amount: 3000000, xpReward: 1000, completed: false },
      { amount: 5000000, xpReward: 2000, completed: false }
    ]
  },
  {
    id: '4',
    title: 'Education Fund',
    description: 'Save for education or courses',
    targetAmount: 100000,
    currentAmount: 0,
    xpReward: 300,
    completed: false,
    bossIcon: BossIcons.education,
    milestones: [
      { amount: 25000, xpReward: 100, completed: false },
      { amount: 50000, xpReward: 150, completed: false },
      { amount: 100000, xpReward: 300, completed: false }
    ]
  }
];

const generateMilestones = (targetAmount: number): Milestone[] => {
  const milestones: Milestone[] = [];
  const steps = [0.1, 0.25, 0.5, 0.75, 1];
  const xpRewards = [100, 250, 500, 750, 1000];

  steps.forEach((step, index) => {
    if (step * targetAmount >= 1000) { // Only add milestones for amounts >= 1000 NOK
      milestones.push({
        amount: Math.round(step * targetAmount),
        xpReward: xpRewards[index],
        completed: false
      });
    }
  });

  return milestones;
};

const motivationalMessages = [
  "Amazing progress! Keep going! 🚀",
  "You're crushing it! 💪",
  "Another milestone conquered! 🎯",
  "Your future self thanks you! 🌟",
  "Financial freedom, here you come! 💫",
  "You're unstoppable! ⭐",
  "Making dreams reality! 🌈",
  "Every step counts! 🎉",
  "You're a savings champion! 🏆",
  "Future you is proud! 🌠"
];

const LevelUp: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: 0,
    icon: 'house' as keyof typeof BossIcons
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  const handleMilestoneComplete = (goalId: string, milestoneIndex: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const milestone = goal.milestones[milestoneIndex];
        if (!milestone.completed) {
          const newXp = xp + milestone.xpReward;
          setXp(newXp);
          const newLevel = calculateLevel(newXp);
          if (newLevel > level) {
            setLevel(newLevel);
          }
          
          const updatedMilestones = [...goal.milestones];
          updatedMilestones[milestoneIndex] = { ...milestone, completed: true };
          
          const allMilestonesCompleted = updatedMilestones.every(m => m.completed);
          
          // Show celebration
          setShowConfetti(true);
          setCelebrationMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
          setTimeout(() => {
            setShowConfetti(false);
            setCelebrationMessage('');
          }, 3000);
          
          return {
            ...goal,
            milestones: updatedMilestones,
            completed: allMilestonesCompleted
          };
        }
      }
      return goal;
    }));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoalWithId: SavingsGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetAmount: newGoal.targetAmount,
      currentAmount: 0,
      xpReward: 1000,
      completed: false,
      bossIcon: BossIcons[newGoal.icon],
      milestones: generateMilestones(newGoal.targetAmount)
    };

    setGoals([...goals, newGoalWithId]);
    setShowNewGoalForm(false);
    setNewGoal({
      title: '',
      description: '',
      targetAmount: 0,
      icon: 'house'
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    setShowDeleteConfirm(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Celebration Effects */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      
      {celebrationMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
        >
          {celebrationMessage}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Delete Goal</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this goal? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteGoal(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CharacterIcon level={level} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Level {level}</h2>
              <div className="w-48 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(xp % 1000) / 10}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{xp} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Goal Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewGoalForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Goal
        </button>
      </div>

      {/* New Goal Form */}
      <AnimatePresence>
        {showNewGoalForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Goal</h2>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Amount (NOK)</label>
                  <input
                    type="text"
                    value={newGoal.targetAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setNewGoal({ ...newGoal, targetAmount: value ? Number(value) : 0 });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon</label>
                  <select
                    value={newGoal.icon}
                    onChange={(e) => setNewGoal({ ...newGoal, icon: e.target.value as keyof typeof BossIcons })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="generic">Generic</option>
                    <option value="house">House</option>
                    <option value="car">Car</option>
                    <option value="retirement">Retirement</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewGoalForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${
              goal.completed ? 'opacity-75' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16">
                {goal.bossIcon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {goal.title}
                  </h3>
                  <button
                    onClick={() => setShowDeleteConfirm(goal.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-2">{goal.description}</p>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
                <div className="space-y-2">
                  {goal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm text-gray-600">
                          {formatCurrency(milestone.amount)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-600 font-medium">
                          +{milestone.xpReward} XP
                        </span>
                        <button
                          onClick={() => handleMilestoneComplete(goal.id, index)}
                          disabled={milestone.completed}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            milestone.completed
                              ? 'bg-green-100 text-green-800 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {milestone.completed ? 'Completed' : 'Complete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LevelUp; 