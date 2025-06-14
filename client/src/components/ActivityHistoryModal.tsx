import { useState } from 'react';
import { ActivityEntry } from '@/lib/types';

interface ActivityHistoryModalProps {
  isOpen: boolean;
  activityHistory: ActivityEntry[];
  onClose: () => void;
}

export default function ActivityHistoryModal({ isOpen, activityHistory, onClose }: ActivityHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'hearts' | 'rewards'>('all');

  if (!isOpen) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getActivityIcon = (type: ActivityEntry['type']) => {
    switch (type) {
      case 'task_completed':
        return 'fas fa-check-circle text-teal';
      case 'reward_claimed':
        return 'fas fa-trophy text-sunny';
      case 'money_collected':
        return 'fas fa-piggy-bank text-mint';
      default:
        return 'fas fa-circle text-gray-400';
    }
  };

  const filterActivities = (activities: ActivityEntry[]) => {
    switch (activeTab) {
      case 'hearts':
        return activities.filter(activity => activity.type === 'task_completed');
      case 'rewards':
        return activities.filter(activity => activity.type === 'reward_claimed' || activity.type === 'money_collected');
      default:
        return activities;
    }
  };

  const sortedHistory = [...activityHistory].sort((a, b) => b.timestamp - a.timestamp);
  const filteredHistory = filterActivities(sortedHistory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-scale-up">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-navy flex items-center">
              <i className="fas fa-history text-coral mr-3"></i>
              Activity History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-white text-navy shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('hearts')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'hearts' 
                  ? 'bg-white text-navy shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Hearts
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rewards' 
                  ? 'bg-white text-navy shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rewards
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-clock text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeTab === 'all' ? 'No Activity Yet' : 
                 activeTab === 'hearts' ? 'No Hearts Earned Yet' : 
                 'No Rewards Claimed Yet'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'all' ? 'Complete tasks and claim rewards to see your activity here!' :
                 activeTab === 'hearts' ? 'Complete tasks to start earning hearts!' :
                 'Claim rewards to see them here!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <i className={`${getActivityIcon(entry.type)} text-2xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-navy">{entry.description}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatTime(entry.timestamp)}</span>
                      {entry.heartsEarned && (
                        <span className="text-coral flex items-center">
                          <i className="fas fa-heart mr-1"></i>
                          +{entry.heartsEarned}
                        </span>
                      )}
                      {entry.heartsSpent && (
                        <span className="text-red-500 flex items-center">
                          <i className="fas fa-heart mr-1"></i>
                          -{entry.heartsSpent}
                        </span>
                      )}
                      {entry.moneyEarned && (
                        <span className="text-mint flex items-center">
                          <i className="fas fa-dollar-sign mr-1"></i>
                          +${entry.moneyEarned}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}