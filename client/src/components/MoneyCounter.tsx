import { getCurrencySymbol } from './CurrencySelector';
import { AppState } from '@/lib/types';

interface MoneyCounterProps {
  money: number;
  currency: AppState['currency'];
}

export default function MoneyCounter({ money, currency }: MoneyCounterProps) {
  return (
    <div className="bg-mint text-navy px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-xl font-bold">
      <i className="fas fa-piggy-bank text-2xl"></i>
      <span>{getCurrencySymbol(currency)}{money}</span>
    </div>
  );
}