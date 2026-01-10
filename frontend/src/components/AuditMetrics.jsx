import { FileWarning, Hash, CheckCircle2, ListChecks, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function AuditMetrics({ auditDetails }) {
  const hardMetrics = auditDetails.hard_metrics_found || 0;
  const vagueCount = auditDetails.vague_language_count || 0;
  
  // Calculate specificity ratio
  const total = hardMetrics + vagueCount;
  const specificityRatio = total > 0 ? Math.round((hardMetrics / total) * 100) : 0;

  const metrics = [
    {
      label: 'Hard Metrics',
      value: hardMetrics,
      icon: Hash,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      iconColor: 'text-emerald-600',
      description: 'Numbers with units (tons, kWh, %)',
      trend: 'good'
    },
    {
      label: 'Vague Terms',
      value: vagueCount,
      icon: FileWarning,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      iconColor: 'text-amber-600',
      description: '"Eco-friendly", "Green", "Sustainable"',
      trend: 'bad'
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Metrics</h3>
      
      {/* Specificity Ratio */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Specificity Ratio</span>
          <span className={`text-lg font-bold ${
            specificityRatio >= 60 ? 'text-emerald-600' : specificityRatio >= 40 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {specificityRatio}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              specificityRatio >= 60 ? 'bg-emerald-500' : specificityRatio >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${specificityRatio}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {specificityRatio >= 60 ? 'Good use of concrete data' : 
           specificityRatio >= 40 ? 'Mix of specific and vague claims' : 
           'Too much vague language'}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.label} 
              className={`p-4 rounded-xl ${metric.bgColor} border ${metric.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                {metric.trend === 'good' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm font-medium text-gray-700">{metric.label}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {/* Major Commitments */}
      {auditDetails.major_commitments && auditDetails.major_commitments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Major Commitments</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {auditDetails.major_commitments.length}
            </span>
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {auditDetails.major_commitments.map((commitment, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{commitment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contradictions Warning */}
      {auditDetails.detected_contradictions && auditDetails.detected_contradictions.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {auditDetails.detected_contradictions.length} contradiction(s) detected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
