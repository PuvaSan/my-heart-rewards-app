import { getCurrencySymbol } from './CurrencySelector';
import { AppState } from '@/lib/types';

interface MoneyCounterProps {
  money: number;
  currency: AppState['currency'];
  onCurrencyToggle: () => void;
}

export default function MoneyCounter({ money, currency, onCurrencyToggle }: MoneyCounterProps) {
  return (
    <div className="bg-mint text-navy px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-xl font-bold">
      <button
        onClick={onCurrencyToggle}
        className="hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-opacity-50 rounded-full p-1 -m-1"
        title={`Click to toggle currency (currently ${currency})`}
      >
        <i className="fas fa-piggy-bank text-2xl"></i>
      </button>
      <span>{getCurrencySymbol(currency)}{money}</span>
    </div>
  );
}
