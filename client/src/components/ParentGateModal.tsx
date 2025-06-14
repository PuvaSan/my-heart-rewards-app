import { Reward } from '@/lib/types';

interface ParentGateModalProps {
  isOpen: boolean;
  reward: Reward | null;
  onConfirm: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export default function ParentGateModal({ isOpen, reward, onConfirm, onDeny, onClose }: ParentGateModalProps) {
  if (!isOpen || !reward) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-up">
        <div className="mb-6">
          <i className="fas fa-user-shield text-6xl text-coral mb-4"></i>
          <h2 className="text-2xl font-bold text-navy mb-2">Parent Check</h2>
          <p className="text-lg text-gray-600 mb-4">Someone wants to claim:</p>
          <div className="bg-sunny bg-opacity-20 rounded-2xl p-4 mb-4">
            <h3 className="text-xl font-semibold text-navy">{reward.text}</h3>
            <p className="text-sunny font-semibold">
              <i className="fas fa-coins mr-1"></i>
              {reward.cost} hearts
            </p>
          </div>
          <p className="text-2xl font-bold text-navy mb-6">Are you a parent?</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onConfirm}
            className="w-full bg-mint hover:bg-green-400 text-navy px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <i className="fas fa-check-circle mr-2"></i>
            Yes, I'm a Parent
          </button>
          
          <button
            onClick={onDeny}
            className="w-full bg-coral hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <i className="fas fa-times-circle mr-2"></i>
            No, I'm Not a Parent
          </button>
        </div>
      </div>
    </div>
  );
}
