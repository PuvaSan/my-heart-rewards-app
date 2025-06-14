import { Reward } from '@/lib/types';

interface RewardsListProps {
  rewards: Reward[];
  hearts: number;
  onClaimReward: (reward: Reward) => void;
  onDeleteReward: (rewardId: string) => void;
}

export default function RewardsList({ rewards, hearts, onClaimReward, onDeleteReward }: RewardsListProps) {
  if (rewards.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-gray-300">
        <i className="fas fa-gift text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No rewards yet!</h3>
        <p className="text-gray-500">Add your first reward to work towards something special.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map((reward) => {
        const canAfford = hearts >= reward.cost;
        const heartsNeeded = reward.cost - hearts;
        
        return (
          <div 
            key={reward.id} 
            className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-200 animate-fade-in ${
              canAfford ? 'border-sunny' : 'border-gray-300 opacity-75'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${canAfford ? 'text-navy' : 'text-gray-600'}`}>
                  {reward.text}
                </h3>
                <div className={`flex items-center space-x-2 font-semibold ${canAfford ? 'text-sunny' : 'text-gray-500'}`}>
                  <i className="fas fa-coins"></i>
                  <span>{reward.cost}</span>
                  <span className="text-gray-600">hearts</span>
                  {!canAfford && heartsNeeded > 0 && (
                    <span className="text-sm text-red-500 ml-2">
                      (Need {heartsNeeded} more!)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => canAfford && onClaimReward(reward)}
                  disabled={!canAfford}
                  className={`px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-200 flex items-center space-x-2 ${
                    canAfford
                      ? 'bg-mint hover:bg-green-400 text-navy hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <i className={`fas ${canAfford ? 'fa-trophy' : 'fa-lock'}`}></i>
                  <span>{canAfford ? 'Claim!' : 'Need More Hearts'}</span>
                </button>
                <button
                  onClick={() => onDeleteReward(reward.id)}
                  className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                  title="Delete reward"
                >
                  <i className="fas fa-trash text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
