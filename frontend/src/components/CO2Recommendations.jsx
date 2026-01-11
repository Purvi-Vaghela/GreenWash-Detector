import { 
  Leaf, TrendingDown, Clock, DollarSign, Award, 
  AlertTriangle, CheckCircle, Zap, Factory, Droplets,
  Wind, Sun, Recycle, Truck
} from 'lucide-react';

const PRIORITY_CONFIG = {
  HIGH: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  LOW: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
};

const ACTION_ICONS = {
  'renewable': Sun,
  'solar': Sun,
  'wind': Wind,
  'energy': Zap,
  'water': Droplets,
  'waste': Recycle,
  'transport': Truck,
  'manufacturing': Factory,
  'default': Leaf
};

function getActionIcon(action) {
  const lowerAction = action.toLowerCase();
  for (const [key, Icon] of Object.entries(ACTION_ICONS)) {
    if (lowerAction.includes(key)) return Icon;
  }
  return ACTION_ICONS.default;
}

export default function CO2Recommendations({ co2Analysis }) {
  if (!co2Analysis) return null;

  const { 
    current_emissions, 
    reduction_potential, 
    recommendations, 
    industry_benchmarks,
    certifications_to_pursue 
  } = co2Analysis;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">CO₂ Reduction Report</h3>
            <p className="text-emerald-100 text-sm">AI-Generated Sustainability Recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-emerald-100 text-xs mb-1">Current Emissions</p>
            <p className="text-lg font-bold">{current_emissions || 'Not specified'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-emerald-100 text-xs mb-1">Reduction Potential</p>
            <p className="text-lg font-bold flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              {reduction_potential || 'To be assessed'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          Recommended Actions
        </h4>

        <div className="space-y-4">
          {recommendations?.map((rec, index) => {
            const Icon = getActionIcon(rec.action);
            const priorityStyle = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.MEDIUM;
            
            return (
              <div 
                key={index} 
                className={`border ${priorityStyle.border} rounded-xl p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 ${priorityStyle.bg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${priorityStyle.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{rec.action}</h5>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                        {rec.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                        <span>{rec.impact}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{rec.timeline}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                        <span>{rec.cost_benefit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industry Benchmark */}
        {industry_benchmarks && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Factory className="w-4 h-4 text-slate-600" />
              <h5 className="font-medium text-gray-900">Industry Benchmark</h5>
            </div>
            <p className="text-sm text-gray-600">{industry_benchmarks}</p>
          </div>
        )}

        {/* Certifications to Pursue */}
        {certifications_to_pursue?.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <h5 className="font-medium text-gray-900">Recommended Certifications</h5>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications_to_pursue.map((cert, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
