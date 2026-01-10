import { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../services/api';
import { FileText, Trash2, Eye, Clock } from 'lucide-react';

export default function ReportHistory({ onSelect, isAdmin }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this report?')) return;
    try {
      await deleteReport(id);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score < 40) return 'bg-red-100 text-red-600';
    if (score < 75) return 'bg-amber-100 text-amber-600';
    return 'bg-emerald-100 text-emerald-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report History</h3>
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Report History</h3>
      
      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No reports yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelect(report)}
              className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {report.analysis.company_info.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{report.filename}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreColor(report.analysis.scores.final_trust_score)}`}>
                      {Math.round(report.analysis.scores.final_trust_score)}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(report.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1.5 hover:bg-emerald-100 rounded-lg">
                    <Eye className="w-4 h-4 text-emerald-600" />
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
