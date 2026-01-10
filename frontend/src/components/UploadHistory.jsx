import { useState, useEffect } from 'react';
import { FileText, Calendar, TrendingUp, Building2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { getReports } from '../services/api';

export default function UploadHistory({ onSelectReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports(); // Get all reports (admin)
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter(r => {
    if (filter === 'all') return true;
    return r.analysis?.scores?.traffic_light?.toUpperCase() === filter;
  });

  const getTrafficIcon = (light) => {
    switch (light?.toUpperCase()) {
      case 'RED': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'YELLOW': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'GREEN': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">All Upload History</h3>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
            {reports.length}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'RED', 'YELLOW', 'GREEN'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === f
                ? f === 'RED' ? 'bg-red-100 text-red-600'
                : f === 'YELLOW' ? 'bg-amber-100 text-amber-600'
                : f === 'GREEN' ? 'bg-emerald-100 text-emerald-600'
                : 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filtered.map(report => (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{report.filename}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.uploaded_at).toLocaleDateString()}
                  </span>
                  {report.analysis?.company_info?.name && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {report.analysis.company_info.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {getTrafficIcon(report.analysis?.scores?.traffic_light)}
                <span className={`text-sm font-bold ${
                  report.analysis?.scores?.final_trust_score >= 70 ? 'text-emerald-600'
                  : report.analysis?.scores?.final_trust_score >= 40 ? 'text-amber-600'
                  : 'text-red-600'
                }`}>
                  {report.analysis?.scores?.final_trust_score}%
                </span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
