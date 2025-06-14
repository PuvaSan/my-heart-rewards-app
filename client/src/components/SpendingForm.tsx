import { useState } from 'react';
import { Purchase, AppState } from '@/lib/types';
import { generateId } from '@/lib/storage';
import { getCurrencySymbol } from './CurrencySelector';

interface SpendingFormProps {
  onAddPurchase: (purchase: Purchase) => void;
  onCancel: () => void;
  isVisible: boolean;
  currency: AppState['currency'];
  availableMoney: number;
}

const purchaseCategories = [
  { value: 'toy', label: '🧸 Toy', icon: 'fas fa-robot' },
  { value: 'treat', label: '🍭 Treat', icon: 'fas fa-candy-cane' },
  { value: 'activity', label: '🎨 Activity', icon: 'fas fa-palette' },
  { value: 'game', label: '🎮 Game', icon: 'fas fa-gamepad' },
  { value: 'book', label: '📚 Book', icon: 'fas fa-book' },
  { value: 'other', label: '✨ Other', icon: 'fas fa-star' }
] as const;

export default function SpendingForm({ onAddPurchase, onCancel, isVisible, currency, availableMoney }: SpendingFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<Purchase['category']>('toy');
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { description?: string; amount?: string } = {};

    if (!description.trim()) {
      newErrors.description = 'Please describe what you bought';
    }

    if (amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (amount > availableMoney) {
      newErrors.amount = `You only have ${getCurrencySymbol(currency)}${availableMoney} available`;
    } else if (amount > 500) {
      newErrors.amount = `Amount must be less than ${getCurrencySymbol(currency)}500`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newPurchase: Purchase = {
      id: generateId(),
      description: description.trim(),
      amount,
      category,
      timestamp: Date.now()
    };

    onAddPurchase(newPurchase);
    setDescription('');
    setAmount(0);
    setCategory('toy');
    setErrors({});
  };

  const handleCancel = () => {
    setDescription('');
    setAmount(0);
    setCategory('toy');
    setErrors({});
    onCancel();
  };

  if (!isVisible) return null;

  const selectedCategoryInfo = purchaseCategories.find(cat => cat.value === category);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-mint animate-fade-in">
      <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
        <i className="fas fa-shopping-cart text-mint mr-2"></i>
        Record a Purchase
      </h3>

      <div className="bg-mint bg-opacity-10 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fas fa-piggy-bank text-mint text-xl"></i>
          <span className="text-navy font-semibold">Available Balance:</span>
        </div>
        <div className="text-2xl font-bold text-mint">
          {getCurrencySymbol(currency)}{availableMoney}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-navy font-semibold mb-2">What category is this purchase?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {purchaseCategories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  category === cat.value
                    ? 'border-mint bg-mint bg-opacity-20 text-navy'
                    : 'border-gray-200 hover:border-mint hover:bg-mint hover:bg-opacity-10 text-gray-600'
                }`}
              >
                <i className={`${cat.icon} text-xl`}></i>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-navy font-semibold mb-2">What did you buy?</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="New toy car, ice cream, art supplies..."
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
              errors.description
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-mint'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-navy font-semibold mb-2">How much did it cost?</label>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-mint">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              max={availableMoney}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={`flex-1 px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                errors.amount
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-mint'
              }`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className={`${selectedCategoryInfo?.icon} text-xl text-mint`}></i>
              <div>
                <p className="font-semibold text-navy">Purchase Summary</p>
                <p className="text-sm text-gray-600">{selectedCategoryInfo?.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-mint">
                {getCurrencySymbol(currency)}{amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Remaining: {getCurrencySymbol(currency)}{(availableMoney - amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={amount > availableMoney || amount <= 0}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-lg shadow-md transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
              amount > availableMoney || amount <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-mint hover:bg-green-400 text-navy hover:shadow-lg'
            }`}
          >
            <i className="fas fa-receipt"></i>
            <span>Record Purchase</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-times"></i>
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
}
