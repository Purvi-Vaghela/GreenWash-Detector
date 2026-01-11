import { useState, useEffect } from 'react';
import { Award, Leaf, Zap, Droplets, Recycle, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getUserCredits } from '../services/api';

const CREDIT_CONFIG = {
  CO2: { icon: Leaf, bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
  Renewable: { icon: Zap, bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' },
  Water: { icon: Droplets, bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
  Waste: { icon: Recycle, bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' },
};

export default function UserCredits({ userId }) {
  const [data, setData] = useState({ transactions: [], balances: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadCredits();
  }, [userId]);

  const loadCredits = async () => {
    try {
      const result = await getUserCredits(userId);
      setData(result);
    } catch (err) {
      console.error('Failed to load credits:', err);
    } finally {
      setLoading(false);
    }
  };

  const { transactions, balances } = data;
  const totalCredits = Object.values(balances).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Your Green Credits</h3>
            <p className="text-emerald-100 text-xs">Current Balance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{totalCredits.toFixed(1)}</p>
          <p className="text-emerald-100 text-xs">Total Balance</p>
        </div>
      </div>

      {Object.keys(balances).length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {Object.entries(balances).map(([type, amount]) => {
            const config = CREDIT_CONFIG[type] || CREDIT_CONFIG.CO2;
            const Icon = config.icon;
            return (
              <div key={type} className="bg-white/10 backdrop-blur rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 ${config.bg} rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{amount.toFixed(1)}</p>
                    <p className="text-xs text-emerald-100">{type}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mt-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-70" />
          <p className="text-sm text-emerald-100">No credits yet</p>
          <p className="text-xs text-emerald-200 mt-1">Submit reports to earn credits</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-emerald-100 mb-2">Recent Transactions</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {transactions.slice(0, 5).map(tx => {
              const isCredit = tx.transaction_type === 'credit';
              return (
                <div key={tx.id} className="bg-white/10 rounded-lg p-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {isCredit ? (
                        <ArrowUpRight className="w-4 h-4 text-green-300" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-300" />
                      )}
                      <span className={isCredit ? 'text-green-200' : 'text-red-200'}>
                        {isCredit ? '+' : '-'}{tx.amount} {tx.credit_type}
                      </span>
                    </div>
                    <span className="text-emerald-200 text-xs">
                      {new Date(tx.assigned_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 truncate mt-1 ml-6">{tx.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
