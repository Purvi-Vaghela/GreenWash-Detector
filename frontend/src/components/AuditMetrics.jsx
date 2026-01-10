import { FileWarning, Hash, CheckCircle2, ListChecks } from 'lucide-react';

export default function AuditMetrics({ auditDetails }) {
  const metrics = [
    {
      label: 'Hard Metrics Found',
      value: auditDetails.hard_metrics_found,
      icon: Hash,
      color: 'emerald',
      description: 'Specific numbers, units, deadlines'
    },
    {
      label: 'Vague Language',
      value: auditDetails.vague_language_count,
      icon: FileWarning,
      color: 'amber',
      description: 'Eco-friendly, green, sustainable...'
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.label} 
              className={`p-4 rounded-xl bg-${metric.color}-50 border border-${metric.color}-100`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-700">{metric.label}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {auditDetails.major_commitments && auditDetails.major_commitments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Major Commitments</span>
          </div>
          <ul className="space-y-2">
            {auditDetails.major_commitments.map((commitment, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                {commitment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
