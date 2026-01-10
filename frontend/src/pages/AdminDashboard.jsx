import { useState } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import PdfPreview from '../components/PdfPreview';
import TrustScoreGauge from '../components/TrustScoreGauge';
import ScoreBreakdown from '../components/ScoreBreakdown';
import AuditMetrics from '../components/AuditMetrics';
import ContradictionsList from '../components/ContradictionsList';
import ReportHistory from '../components/ReportHistory';
import { useAuth } from '../contexts/AuthContext';
import { analyzeReport, previewPdf } from '../services/api';
import { Shield, AlertTriangle, Factory, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      const data = await analyzeReport(file);
      setResult(data.analysis);
      setPreview(null);
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
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Government Admin Dashboard</h2>
            <p className="text-gray-600">Full audit access with contradiction detection & legal risk assessment</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FileUpload 
              file={file} 
              setFile={handleFileChange} 
              onAnalyze={handleAnalyze}
              onPreview={handlePreview}
              loading={loading}
              previewLoading={previewLoading}
            />
            <ReportHistory onSelect={handleSelectReport} isAdmin={true} userId={null} />
          </div>

          {/* Show Preview Data */}
          {preview && !result && (
            <div className="lg:col-span-2">
              <PdfPreview preview={preview} />
            </div>
          )}

          {/* Show Analysis Results */}
          {result && (
            <>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Factory className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {result.company_info.name}
                      </h3>
                      <p className="text-gray-500">
                        {result.company_info.industry_type} • {result.company_info.primary_focus}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      result.scores.traffic_light === 'RED' 
                        ? 'bg-red-100 text-red-600' 
                        : result.scores.traffic_light === 'YELLOW'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {result.scores.traffic_light}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <TrustScoreGauge score={result.scores.final_trust_score} />
                    <ScoreBreakdown scores={result.scores} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <AuditMetrics auditDetails={result.audit_details} />
              </div>

              <div className="lg:col-span-2">
                <ContradictionsList contradictions={result.audit_details.detected_contradictions} />
              </div>

              {/* Admin-only: Confidential Brief */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold">Confidential Admin Brief</h3>
                    <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                      GOVT OFFICIALS ONLY
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.admin_brief}
                  </p>
                </div>
              </div>
            </>
          )}

          {!result && !preview && !loading && !previewLoading && (
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-500">No Report Under Review</h3>
                <p className="text-gray-400 mt-1">Upload a corporate sustainability report to audit</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
