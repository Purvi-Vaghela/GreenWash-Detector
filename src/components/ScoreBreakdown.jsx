import { Target, GitCompare, BadgeCheck, Info } from 'lucide-react';

export default function ScoreBreakdown({ scores }) {
  const data = [
    { 
      name: 'Specificity', 
      value: scores.specificity, 
      weight: 0.40,
      icon: Target,
      description: 'Hard metrics with units (tons CO2, kWh, liters)'
    },
    { 
      name: 'Consistency', 
      value: scores.consistency, 
      weight: 0.35,
      icon: GitCompare,
      description: 'Claims vs external news alignment'
    },
    { 
      name: 'Verification', 
      value: scores.verification, 
      weight: 0.25,
      icon: BadgeCheck,
      description: 'Third-party certifications (ISO, B-Corp, SBTi)'
    },
  ];

  const getBarColor = (value) => {
    if (value < 40) return '#ef4444';
    if (value < 75) return '#f59e0b';
    return '#10b981';
  };

  // Calculate weighted contributions
  const contributions = data.map(d => ({
    ...d,
    contribution: (d.value * d.weight).toFixed(1)
  }));

  const calculatedTotal = contributions.reduce((sum, d) => sum + parseFloat(d.contribution), 0);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
      
      <div className="space-y-4">
        {contributions.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-400">×{item.weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">= {item.contribution}</span>
                  <span className="font-bold w-8 text-right" style={{ color: getBarColor(item.value) }}>
                    {item.value}
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: getBarColor(item.value) 
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Formula Display */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 mt-0.5" />
          <div className="text-xs text-slate-600">
            <p className="font-semibold mb-1">Trust Score Formula:</p>
            <p className="font-mono bg-white px-2 py-1 rounded border text-slate-700">
              T = (0.40 × {scores.specificity}) + (0.35 × {scores.consistency}) + (0.25 × {scores.verification})
            </p>
            <p className="mt-2 font-mono">
              T = {(scores.specificity * 0.40).toFixed(1)} + {(scores.consistency * 0.35).toFixed(1)} + {(scores.verification * 0.25).toFixed(1)} = <span className="font-bold">{calculatedTotal.toFixed(1)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Score Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-500">&lt;40 High Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-gray-500">40-74 Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-500">≥75 Low Risk</span>
        </div>
      </div>
    </div>
  );
}
