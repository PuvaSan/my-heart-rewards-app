interface MoneyCounterProps {
  money: number;
}

export default function MoneyCounter({ money }: MoneyCounterProps) {
  return (
    <div className="bg-mint text-navy px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-xl font-bold">
      <i className="fas fa-piggy-bank text-2xl"></i>
      <span>${money}</span>
    </div>
  );
}