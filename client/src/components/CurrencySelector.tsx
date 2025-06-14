import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppState } from '@/lib/types';

interface CurrencySelectorProps {
  currency: AppState['currency'];
  onCurrencyChange: (currency: AppState['currency']) => void;
}

const currencyOptions = [
  { value: 'YEN', label: '¥ Yen', symbol: '¥' },
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ Euro', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' }
];

export const getCurrencySymbol = (currency: AppState['currency']): string => {
  return currencyOptions.find(opt => opt.value === currency)?.symbol || '¥';
};

export default function CurrencySelector({ currency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <Select value={currency} onValueChange={onCurrencyChange}>
      <SelectTrigger className="w-24 h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}