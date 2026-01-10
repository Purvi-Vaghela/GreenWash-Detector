import { useState } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import PdfPreview from '../components/PdfPreview';
import TrustScoreGauge from '../components/TrustScoreGauge';
import ScoreBreakdown from '../components/ScoreBreakdown';
import AuditMetrics from '../components/AuditMetrics';
import UserCredits from '../components/UserCredits';
import UserReportsList from '../components/UserReportsList';
import { useAuth } from '../contexts/AuthContext';
import { analyzeReport, previewPdf } from '../services/api';
import { Lightbulb, Factory, Upload, BarChart3, X } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const handlePreview = async () => {
    if (!file) return;
    setPreviewLoading(true);
    setError(null);
    try {
      const data = await previewPdf(file);
      setPreview(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract PDF data.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeReport(file, user?.id);
      setResult(data.analysis);
      setPreview(null);
      setShowUpload(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (report) => {
    setResult(report.analysis);
    setFile(null);
    setPreview(null);
    setShowUpload(false);
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
    setPreview(null);
    setResult(null);
  };

  const clearResult = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.company_name || 'Industry Partner'}</h2>
            <p className="text-gray-600 mt-1">Track your sustainability performance and green credits</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            <Upload className="w-4 h-4" />
            Upload Report
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content */}
        {!result && !showUpload && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Credits Card */}
            <div className="lg:col-span-1">
              <UserCredits userId={user?.id} />
            </div>

            {/* Reports List */}
            <div className="lg:col-span-2">
              <UserReportsList userId={user?.id} onSelectReport={handleSelectReport} />
            </div>
          </div>
        )}

        {/* Upload Modal/Section */}
        {showUpload && !result && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload New Report</h3>
                <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FileUpload 
                file={file} 
                setFile={handleFileChange} 
                onAnalyze={handleAnalyze}
                onPreview={handlePreview}
                loading={loading}
                previewLoading={previewLoading}
              />
            </div>
            <div>
              {preview ? (
                <PdfPreview preview={preview} />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center h-full min-h-64">
                  <div className="text-center text-gray-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Upload a PDF to preview extracted data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
              <button 
                onClick={clearResult}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Company Info & Scores */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Factory className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{result.company_info.name}</h3>
                      <p className="text-gray-500">{result.company_info.industry_type} • {result.company_info.primary_focus}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      result.scores.traffic_light === 'RED' ? 'bg-red-100 text-red-600'
                      : result.scores.traffic_light === 'YELLOW' ? 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {result.scores.traffic_light === 'RED' ? '⚠️ High Risk' 
                       : result.scores.traffic_light === 'YELLOW' ? '⚡ Medium Risk' 
                       : '✓ Low Risk'}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <TrustScoreGauge score={result.scores.final_trust_score} />
                    <ScoreBreakdown scores={result.scores} />
                  </div>
                </div>
              </div>

              {/* Audit Metrics */}
              <div className="lg:col-span-1">
                <AuditMetrics auditDetails={result.audit_details} />
              </div>

              {/* Feedback */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">How to Improve Your Score</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{result.client_feedback}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
