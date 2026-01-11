import { useState } from 'react';
import { FileText, Calendar, Award, Hash, ChevronDown, ChevronUp, Table, FileSearch } from 'lucide-react';

export default function PdfPreview({ preview }) {
  const [showFullText, setShowFullText] = useState(false);
  const [activeTab, setActiveTab] = useState('data');

  if (!preview) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 border-b pb-4">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{preview.company_name}</h3>
          <p className="text-sm text-gray-500">{preview.filename}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">{preview.total_pages} pages</span>
            <span className="bg-gray-100 px-2 py-1 rounded">{preview.total_words?.toLocaleString()} words</span>
            <span className="bg-gray-100 px-2 py-1 rounded">{preview.file_size_mb} MB</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            activeTab === 'data' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Table className="w-4 h-4 inline mr-1" />
          Extracted Data
        </button>
        <button
          onClick={() => setActiveTab('numbers')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            activeTab === 'numbers' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Hash className="w-4 h-4 inline mr-1" />
          Numeric Data
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            activeTab === 'text' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileSearch className="w-4 h-4 inline mr-1" />
          Full Text
        </button>
      </div>

      {/* Extracted Fields Tab */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          {/* Certifications & Years */}
          <div className="grid grid-cols-2 gap-4">
            {preview.certifications?.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1">
                  <Award className="w-4 h-4" /> Certifications Found
                </h4>
                <div className="flex flex-wrap gap-2">
                  {preview.certifications.map((cert, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {preview.years_mentioned?.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Years Referenced
                </h4>
                <div className="flex flex-wrap gap-2">
                  {preview.years_mentioned.map((year, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Extracted Key-Value Data */}
          {preview.extracted_fields?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Extracted Fields</h4>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">Field</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {preview.extracted_fields.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{item.field}</td>
                        <td className="px-4 py-2 text-gray-600">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {preview.extracted_fields?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No structured key-value data found in PDF</p>
              <p className="text-sm">Check the "Full Text" tab for raw content</p>
            </div>
          )}
        </div>
      )}

      {/* Numeric Data Tab */}
      {activeTab === 'numbers' && (
        <div>
          {preview.numeric_data?.length > 0 ? (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Value</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Unit</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {preview.numeric_data.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono font-bold text-emerald-600">{item.value}</td>
                      <td className="px-4 py-2 text-gray-600">{item.unit || '-'}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{item.context}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Hash className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No numeric data with units found</p>
            </div>
          )}
        </div>
      )}

      {/* Full Text Tab */}
      {activeTab === 'text' && (
        <div>
          {/* Page by Page View */}
          {preview.pages?.map((page, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-xl">
                <span className="font-medium text-gray-700">Page {page.page_number}</span>
                <span className="text-sm text-gray-500">{page.word_count} words</span>
              </div>
              <div className="border border-t-0 rounded-b-xl p-4 bg-gray-50 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {page.text || 'No text content on this page'}
                </pre>
              </div>
            </div>
          ))}

          {/* Full Text Toggle */}
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="w-full py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1"
          >
            {showFullText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showFullText ? 'Hide' : 'Show'} Complete Raw Text
          </button>
          
          {showFullText && (
            <div className="mt-4 p-4 bg-gray-900 rounded-xl max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                {preview.full_text}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
