import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import PdfPreview from '../components/PdfPreview';
import TrustScoreGauge from '../components/TrustScoreGauge';
import ScoreBreakdown from '../components/ScoreBreakdown';
import AuditMetrics from '../components/AuditMetrics';
import ContradictionsList from '../components/ContradictionsList';
import ReportHistory from '../components/ReportHistory';
import CompanyList from '../components/CompanyList';
import CreditAssignmentModal from '../components/CreditAssignmentModal';
import AdminStatsCharts from '../components/AdminStatsCharts';
import { useAuth } from '../contexts/AuthContext';
import { 
  analyzeReport, previewPdf, getAllCompanies, getAdminStats, 
  assignCredit, getReports 
} from '../services/api';
import { 
  Shield, AlertTriangle, Factory, FileText, Building2, 
  Award, BarChart3, Upload 
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'audit', label: 'Audit Reports', icon: Upload },
  { id: 'credits', label: 'Credits', icon: Award },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [creditModal, setCreditModal] = useState({ open: false, company: null });
  const [creditLoading, setCreditLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyReports, setCompanyReports] = useState([]);

  useEffect(() => { loadAdminData(); }, []);

  const loadAdminData = async () => {
    setDataLoading(true);
    try {
      const [companiesData, statsData] = await Promise.all([
        getAllCompanies(), getAdminStats()
      ]);
      setCompanies(companiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

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
      loadAdminData();
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
    setActiveTab('audit');
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
    setPreview(null);
    setResult(null);
  };

  const handleAssignCredit = (company) => {
    setCreditModal({ open: true, company });
  };

  const handleCreditSubmit = async (creditData) => {
    setCreditLoading(true);
    try {
      await assignCredit(creditData);
      setCreditModal({ open: false, company: null });
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to assign credit.');
    } finally {
      setCreditLoading(false);
    }
  };

  const handleViewReports = async (company) => {
    setSelectedCompany(company);
    try {
      const reports = await getReports(company.id);
      setCompanyReports(reports);
    } catch (err) {
      console.error('Failed to load company reports:', err);
    }
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

        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">{error}</div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <AdminStatsCharts stats={stats} />
            )}
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {dataLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <CompanyList companies={companies} onAssignCredit={handleAssignCredit} onViewReports={handleViewReports} />
              )}
            </div>
            <div>
              {selectedCompany ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{selectedCompany.company_name} Reports</h3>
                    <button onClick={() => setSelectedCompany(null)} className="text-sm text-gray-500 hover:text-gray-700">Clear</button>
                  </div>
                  {companyReports.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {companyReports.map(report => (
                        <div key={report.id} onClick={() => handleSelectReport(report)}
                          className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <p className="font-medium text-sm truncate">{report.filename}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{new Date(report.uploaded_at).toLocaleDateString()}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              report.analysis?.scores?.traffic_light === 'RED' ? 'bg-red-100 text-red-600'
                              : report.analysis?.scores?.traffic_light === 'YELLOW' ? 'bg-amber-100 text-amber-600'
                              : 'bg-emerald-100 text-emerald-600'
                            }`}>{report.analysis?.scores?.final_trust_score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No reports found</p>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center py-8 text-gray-400">
                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a company to view reports</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <FileUpload file={file} setFile={handleFileChange} onAnalyze={handleAnalyze}
                onPreview={handlePreview} loading={loading} previewLoading={previewLoading} />
              <ReportHistory onSelect={handleSelectReport} isAdmin={true} userId={null} />
            </div>

            {preview && !result && (
              <div className="lg:col-span-2"><PdfPreview preview={preview} /></div>
            )}

            {result && (
              <>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Factory className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{result.company_info.name}</h3>
                        <p className="text-gray-500">{result.company_info.industry_type} • {result.company_info.primary_focus}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        result.scores.traffic_light === 'RED' ? 'bg-red-100 text-red-600'
                        : result.scores.traffic_light === 'YELLOW' ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                      }`}>{result.scores.traffic_light}</div>
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

                <div className="lg:col-span-3">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold">Confidential Admin Brief</h3>
                      <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">GOVT OFFICIALS ONLY</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{result.admin_brief}</p>
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
        )}

        {activeTab === 'credits' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold">Assign New Credit</h3>
              </div>
              <p className="text-gray-500 mb-4">Select a company from the list to assign credits</p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {companies.map(company => (
                  <div key={company.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{company.company_name}</p>
                      <p className="text-sm text-gray-500">{company.industry_type}</p>
                    </div>
                    <button onClick={() => handleAssignCredit(company)}
                      className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Assign</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Recent Credit Assignments</h3>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {companies.flatMap(c => c.credits || []).length > 0 ? (
                  companies.flatMap(c => c.credits || [])
                    .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
                    .slice(0, 20)
                    .map(credit => (
                      <div key={credit.id} className="p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{credit.company_name}</span>
                          <span className="text-emerald-600 font-bold">+{credit.amount} {credit.credit_type}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{credit.reason}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(credit.assigned_at).toLocaleDateString()}</p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No credits assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {creditModal.open && (
        <CreditAssignmentModal company={creditModal.company}
          onClose={() => setCreditModal({ open: false, company: null })}
          onAssign={handleCreditSubmit} loading={creditLoading} />
      )}
    </div>
  );
}
