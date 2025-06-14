import { useState } from 'react';
import { Reward } from '@/lib/types';
import { generateId } from '@/lib/storage';

interface RewardFormProps {
  onCreateReward: (reward: Reward) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export default function RewardForm({ onCreateReward, onCancel, isVisible }: RewardFormProps) {
  const [text, setText] = useState('');
  const [cost, setCost] = useState<number>(1);
  const [errors, setErrors] = useState<{ text?: string; cost?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { text?: string; cost?: string } = {};
    
    if (!text.trim()) {
      newErrors.text = 'Please describe your reward';
    }
    
    if (cost < 1 || cost > 200) {
      newErrors.cost = 'Cost must be between 1 and 200 hearts';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const newReward: Reward = {
      id: generateId(),
      text: text.trim(),
      cost
    };
    
    onCreateReward(newReward);
    setText('');
    setCost(1);
    setErrors({});
  };

  const handleCancel = () => {
    setText('');
    setCost(1);
    setErrors({});
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-yellow-200 animate-fade-in">
      <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
        <i className="fas fa-plus-circle text-sunny mr-2"></i>
        Create New Reward
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-navy font-semibold mb-2">What reward do you want to work towards?</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="30 minutes extra screen time, special dessert, toy..."
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
              errors.text 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-sunny'
            }`}
          />
          {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
        </div>
        <div>
          <label className="block text-navy font-semibold mb-2">How many hearts does it cost?</label>
          <input
            type="number"
            min="1"
            max="200"
            value={cost}
            onChange={(e) => setCost(parseInt(e.target.value) || 1)}
            placeholder="20"
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
              errors.cost 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-sunny'
            }`}
          />
          {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-sunny hover:bg-yellow-500 text-navy px-6 py-3 rounded-xl font-semibold flex-1 text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <i className="fas fa-check mr-2"></i>Create Reward
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold flex-1 text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
