import { Building2, FileText, TrendingUp, Award, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminStatsCharts({ stats }) {
  if (!stats) return null;

  const { traffic_light_distribution, credit_totals, industry_distribution } = stats;
  const totalReports = (traffic_light_distribution?.red || 0) + 
                       (traffic_light_distribution?.yellow || 0) + 
                       (traffic_light_distribution?.green || 0);

  const getPercentage = (value) => totalReports > 0 ? Math.round((value / totalReports) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total_companies}</p>
              <p className="text-sm text-gray-500">Companies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total_reports}</p>
              <p className="text-sm text-gray-500">Reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avg_trust_score || 'N/A'}%</p>
              <p className="text-sm text-gray-500">Avg Trust Score</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(credit_totals || {}).reduce((a, b) => a + b, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">Total Credits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Light Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Report Risk Distribution</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">High Risk (Red)</span>
                </div>
                <span className="text-sm font-medium">{traffic_light_distribution?.red || 0}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${getPercentage(traffic_light_distribution?.red || 0)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-600">Medium Risk (Yellow)</span>
                </div>
                <span className="text-sm font-medium">{traffic_light_distribution?.yellow || 0}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${getPercentage(traffic_light_distribution?.yellow || 0)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">Low Risk (Green)</span>
                </div>
                <span className="text-sm font-medium">{traffic_light_distribution?.green || 0}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${getPercentage(traffic_light_distribution?.green || 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Credit Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Credits by Type</h4>
          {Object.keys(credit_totals || {}).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(credit_totals).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <span className="text-lg font-bold text-emerald-600">{amount.toFixed(1)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No credits assigned yet</p>
            </div>
          )}
        </div>

        {/* Industry Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Companies by Industry</h4>
          {Object.keys(industry_distribution || {}).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(industry_distribution)
                .sort((a, b) => b[1] - a[1])
                .map(([industry, count]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate flex-1">{industry}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(count / stats.total_companies) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No companies registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
