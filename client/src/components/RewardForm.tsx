import { useState } from 'react';
import { Reward, AppState } from '@/lib/types';
import { generateId } from '@/lib/storage';
import { getCurrencySymbol } from './CurrencySelector';

interface RewardFormProps {
  onCreateReward: (reward: Reward) => void;
  onCancel: () => void;
  isVisible: boolean;
  currency: AppState['currency'];
}

export default function RewardForm({ onCreateReward, onCancel, isVisible, currency }: RewardFormProps) {
  const [text, setText] = useState('');
  const [cost, setCost] = useState<number>(1);
  const [moneyValue, setMoneyValue] = useState<number>(0);
  const [errors, setErrors] = useState<{ text?: string; cost?: string; moneyValue?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { text?: string; cost?: string; moneyValue?: string } = {};

    if (!text.trim()) {
      newErrors.text = 'Please describe your reward';
    }

    if (cost < 1 || cost > 200) {
      newErrors.cost = 'Cost must be between 1 and 200 hearts';
    }

    if (moneyValue < 0 || moneyValue > 100) {
      newErrors.moneyValue = `Money value must be between 0 and ${getCurrencySymbol(currency)}100`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newReward: Reward = {
      id: generateId(),
      text: text.trim(),
      cost,
      moneyValue: moneyValue > 0 ? moneyValue : undefined
    };

    onCreateReward(newReward);
    setText('');
    setCost(1);
    setMoneyValue(0);
    setErrors({});
  };

  const handleCancel = () => {
    setText('');
    setCost(1);
    setMoneyValue(0);
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
        <div>
          <label className="block text-navy font-semibold mb-2">Money value (optional)</label>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-mint">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              min="0"
              max="100"
              value={moneyValue}
              onChange={(e) => setMoneyValue(parseInt(e.target.value) || 0)}
              placeholder="0"
              className={`flex-1 px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                errors.moneyValue
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-mint'
              }`}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">Add a money value that can be collected after claiming this reward</p>
          {errors.moneyValue && <p className="text-red-500 text-sm mt-1">{errors.moneyValue}</p>}
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
