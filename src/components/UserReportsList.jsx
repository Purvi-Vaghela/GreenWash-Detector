import { useState, useEffect } from 'react';
import { FileText, Eye, Calendar, TrendingUp, AlertCircle, CheckCircle, AlertTriangle, BarChart2 } from 'lucide-react';
import { getReports } from '../services/api';

export default function UserReportsList({ userId, onSelectReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadReports();
  }, [userId]);

  const loadReports = async () => {
    try {
      const data = await getReports(userId);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return { bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' };
    if (score >= 40) return { bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-500' };
    return { bg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-500' };
  };

  const getTrafficIcon = (light) => {
    switch (light?.toUpperCase()) {
      case 'RED': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'YELLOW': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'GREEN': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return null;
    }
  };

  // Calculate stats
  const avgScore = reports.length > 0 
    ? reports.reduce((sum, r) => sum + (r.analysis?.scores?.final_trust_score || 0), 0) / reports.length 
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Your Reports
            </h3>
            <p className="text-slate-300 text-sm mt-1">Track your sustainability performance</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-xs text-slate-400">Total Reports</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{avgScore.toFixed(0)}%</p>
              <p className="text-xs text-slate-400">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-4">
        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map(report => {
              const score = report.analysis?.scores?.final_trust_score || 0;
              const colors = getScoreColor(score);
              return (
                <div
                  key={report.id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => onSelectReport(report)}
                >
                  <div className="flex items-center gap-4">
                    {/* Score Circle */}
                    <div className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-lg font-bold ${colors.text}`}>{score}%</span>
                    </div>

                    {/* Report Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 truncate">{report.filename}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.uploaded_at).toLocaleDateString()}
                        </span>
                        <span>{report.analysis?.company_info?.industry_type}</span>
                      </div>
                      {/* Score Bar */}
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors.bar} rounded-full transition-all`} style={{ width: `${score}%` }} />
                      </div>
                    </div>

                    {/* Traffic Light & View */}
                    <div className="flex items-center gap-3">
                      {getTrafficIcon(report.analysis?.scores?.traffic_light)}
                      <button className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h4 className="font-medium text-gray-600">No Reports Yet</h4>
            <p className="text-sm text-gray-400 mt-1">Upload your first sustainability report to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
