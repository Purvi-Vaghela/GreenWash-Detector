import { useState } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import PdfPreview from '../components/PdfPreview';
import TrustScoreGauge from '../components/TrustScoreGauge';
import ScoreBreakdown from '../components/ScoreBreakdown';
import AuditMetrics from '../components/AuditMetrics';
import ReportHistory from '../components/ReportHistory';
import { useAuth } from '../contexts/AuthContext';
import { analyzeReport, previewPdf } from '../services/api';
import { Lightbulb, Building2, Factory } from 'lucide-react';

export default function ClientDashboard() {
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
      const data = await analyzeReport(file, user?.id);
      setResult(data.analysis);
      setPreview(null); // Clear preview after analysis
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Industry Dashboard</h2>
          <p className="text-gray-600 mt-1">Upload your sustainability report for AI-powered ESG audit</p>
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
            <ReportHistory onSelect={handleSelectReport} isAdmin={false} userId={user?.id} />
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
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Factory className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {result.company_info.name}
                      </h3>
                      <p className="text-gray-500">
                        {result.company_info.industry_type} • {result.company_info.primary_focus}
                      </p>
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
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">How to Improve</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {result.client_feedback}
                  </p>
                </div>
              </div>
            </>
          )}

          {!result && !preview && !loading && !previewLoading && (
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-500">No Report Analyzed Yet</h3>
                <p className="text-gray-400 mt-1">Upload a PDF to preview data or run full analysis</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
