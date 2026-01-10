import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Target, GitCompare, BadgeCheck } from 'lucide-react';

export default function ScoreBreakdown({ scores }) {
  const data = [
    { name: 'Specificity', value: scores.specificity, weight: '40%', icon: Target },
    { name: 'Consistency', value: scores.consistency, weight: '35%', icon: GitCompare },
    { name: 'Verification', value: scores.verification, weight: '25%', icon: BadgeCheck },
  ];

  const getBarColor = (value) => {
    if (value < 40) return '#ef4444';
    if (value < 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Breakdown</h3>
      
      <div className="space-y-4">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-400">({item.weight})</span>
                </div>
                <span className="font-bold" style={{ color: getBarColor(item.value) }}>
                  {item.value}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: getBarColor(item.value) 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Formula:</strong> T = (0.40 × Specificity) + (0.35 × Consistency) + (0.25 × Verification)
        </p>
      </div>
    </div>
  );
}
