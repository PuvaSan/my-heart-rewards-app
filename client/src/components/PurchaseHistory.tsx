import { Purchase, AppState } from '@/lib/types';
import { getCurrencySymbol } from './CurrencySelector';

interface PurchaseHistoryProps {
  purchases: Purchase[];
  currency: AppState['currency'];
}

const categoryIcons = {
  toy: 'fas fa-robot',
  treat: 'fas fa-candy-cane',
  activity: 'fas fa-palette',
  game: 'fas fa-gamepad',
  book: 'fas fa-book',
  other: 'fas fa-star'
};

const categoryColors = {
  toy: 'bg-blue-100 text-blue-700 border-blue-200',
  treat: 'bg-pink-100 text-pink-700 border-pink-200',
  activity: 'bg-purple-100 text-purple-700 border-purple-200',
  game: 'bg-green-100 text-green-700 border-green-200',
  book: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function PurchaseHistory({ purchases, currency }: PurchaseHistoryProps) {
  if (!purchases || purchases.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-gray-300">
        <i className="fas fa-receipt text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No purchases yet!</h3>
        <p className="text-gray-500">Start spending your hard-earned money and track your purchases here.</p>
      </div>
    );
  }

  const safePurchases = purchases || [];
  const totalSpent = safePurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const categoryTotals = safePurchases.reduce((totals, purchase) => {
    totals[purchase.category] = (totals[purchase.category] || 0) + purchase.amount;
    return totals;
  }, {} as Record<Purchase['category'], number>);

  const sortedPurchases = [...safePurchases].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <>
      {/* Spending Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-mint mb-6">
        <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
          <i className="fas fa-chart-pie text-mint mr-2"></i>
          Spending Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-mint bg-opacity-10 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-white">
              {getCurrencySymbol(currency)}{totalSpent.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
            <p className="text-3xl font-bold text-blue-600">{safePurchases.length}</p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-navy">Spending by Category</h4>
          {Object.entries(categoryTotals).map(([category, total]) => {
            const maxTotal = Math.max(...Object.values(categoryTotals));
            const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${categoryIcons[category as Purchase['category']]} text-lg`}></i>
                  <span className="capitalize font-medium">{category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-mint h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-mint w-24 text-right">
                    {getCurrencySymbol(currency)}{total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-mint bg-opacity-10 px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-navy flex items-center">
            <i className="fas fa-receipt text-mint mr-2"></i>
            Purchase History
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {sortedPurchases.map((purchase) => {
            const date = new Date(purchase.timestamp);
            const timeAgo = getTimeAgo(purchase.timestamp);
            return (
              <div key={purchase.id} className="p-1gst hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className={`p-1 rounded-full ${categoryColors[purchase.category]} flex-shrink-0`}>
                      <i className={`${categoryIcons[purchase.category]} text-sm`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-navy text-sm truncate">{purchase.description}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span className="capitalize">{purchase.category}</span>
                        <span>•</span>
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-mint">
                      -{getCurrencySymbol(currency)}{purchase.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
}
