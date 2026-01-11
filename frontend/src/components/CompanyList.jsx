import { useState } from 'react';
import { Building2, Mail, FileText, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyList({ companies, onAssignCredit, onViewReports }) {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');

  const industries = [...new Set(companies.map(c => c.industry_type))];

  const filtered = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.gst_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || company.industry_type === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Registered Companies</h3>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            {companies.length}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or GST..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filtered.map(company => (
          <div key={company.id} className="border border-gray-100 rounded-xl overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === company.id ? null : company.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{company.company_name}</h4>
                    <p className="text-sm text-gray-500">{company.gst_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>{company.total_reports} reports</span>
                    </div>
                    {company.avg_trust_score && (
                      <div className={`flex items-center gap-1 text-sm ${getScoreColor(company.avg_trust_score)}`}>
                        <TrendingUp className="w-4 h-4" />
                        <span>{company.avg_trust_score}% avg score</span>
                      </div>
                    )}
                  </div>
                  {expandedId === company.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === company.id && (
              <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {company.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <p className="font-medium">{company.industry_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Registered:</span>
                    <p className="font-medium">{new Date(company.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Credits Assigned:</span>
                    <p className="font-medium">{company.credits?.length || 0}</p>
                  </div>
                </div>

                {company.credits?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Credit Balances:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(company.credit_balances || {}).map(([type, balance]) => (
                        <span key={type} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          balance > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Award className="w-3 h-3" />
                          {balance} {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onAssignCredit(company)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Assign Credit
                  </button>
                  <button
                    onClick={() => onViewReports(company)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No companies found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
