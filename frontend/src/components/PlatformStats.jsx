import { useState, useEffect } from 'react';
import { 
  TrendingUp, Building2, FileText, Award, Shield,
  Target, GitCompare, BadgeCheck, AlertCircle, CheckCircle, AlertTriangle
} from 'lucide-react';
import { getPublicStats } from '../services/api';

export default function PlatformStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getPublicStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load platform stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 75) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (!score) return 'bg-gray-100';
    if (score >= 75) return 'bg-emerald-50';
    if (score >= 40) return 'bg-amber-50';
    return 'bg-red-50';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const totalRisk = (stats.risk_distribution?.green || 0) + 
                    (stats.risk_distribution?.yellow || 0) + 
                    (stats.risk_distribution?.red || 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Platform Statistics</h3>
        </div>
        <p className="text-blue-100 text-sm">Government verified industry benchmarks</p>
      </div>

      <div className="p-6">
        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.total_companies}</p>
            <p className="text-xs text-gray-500">Companies</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.total_reports}</p>
            <p className="text-xs text-gray-500">Reports</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.total_credits_distributed || 0}</p>
            <p className="text-xs text-gray-500">Credits</p>
          </div>
        </div>

        {/* Platform Average Trust Score */}
        <div className={`p-4 rounded-xl mb-6 ${getScoreBg(stats.platform_avg_trust_score)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Platform Avg Trust Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(stats.platform_avg_trust_score)}`}>
                {stats.platform_avg_trust_score || 'N/A'}%
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
              style={{ 
                borderColor: stats.platform_avg_trust_score >= 75 ? '#10b981' : 
                             stats.platform_avg_trust_score >= 40 ? '#f59e0b' : '#ef4444'
              }}>
              <TrendingUp className={`w-6 h-6 ${getScoreColor(stats.platform_avg_trust_score)}`} />
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700">Average Score Breakdown</p>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-gray-600">Specificity</span>
              <span className="text-xs text-gray-400">(40%)</span>
            </div>
            <span className={`font-bold ${getScoreColor(stats.avg_specificity)}`}>
              {stats.avg_specificity || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Consistency</span>
              <span className="text-xs text-gray-400">(35%)</span>
            </div>
            <span className={`font-bold ${getScoreColor(stats.avg_consistency)}`}>
              {stats.avg_consistency || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">Verification</span>
              <span className="text-xs text-gray-400">(25%)</span>
            </div>
            <span className={`font-bold ${getScoreColor(stats.avg_verification)}`}>
              {stats.avg_verification || 'N/A'}
            </span>
          </div>
        </div>

        {/* Risk Distribution */}
        {totalRisk > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Risk Distribution</p>
            <div className="flex gap-2">
              <div className="flex-1 text-center p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-600">{stats.risk_distribution?.green || 0}</p>
                <p className="text-xs text-gray-500">Low Risk</p>
              </div>
              <div className="flex-1 text-center p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-amber-600">{stats.risk_distribution?.yellow || 0}</p>
                <p className="text-xs text-gray-500">Medium</p>
              </div>
              <div className="flex-1 text-center p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-600">{stats.risk_distribution?.red || 0}</p>
                <p className="text-xs text-gray-500">High Risk</p>
              </div>
            </div>
          </div>
        )}

        {/* Industry Averages */}
        {Object.keys(stats.industry_averages || {}).length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Industry Averages</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(stats.industry_averages)
                .sort((a, b) => b[1] - a[1])
                .map(([industry, score]) => (
                  <div key={industry} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 truncate flex-1">{industry}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            score >= 75 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-10 text-right ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
