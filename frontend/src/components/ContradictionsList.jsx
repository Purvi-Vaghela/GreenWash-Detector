import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function ContradictionsList({ contradictions }) {
  if (!contradictions || contradictions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Contradictions</h3>
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No contradictions detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Detected Contradictions</h3>
        <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
          {contradictions.length} Found
        </span>
      </div>
      
      <div className="space-y-4">
        {contradictions.map((item, index) => (
          <div key={index} className="border border-red-100 rounded-xl p-4 bg-red-50/50">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Company Claim</span>
                <p className="text-gray-900 font-medium mt-1">"{item.claim}"</p>
              </div>
              <div className="border-l-2 border-red-400 pl-3">
                <span className="text-xs font-semibold text-red-600 uppercase">Reality Check</span>
                <p className="text-gray-700 mt-1">{item.reality}</p>
              </div>
              {item.source && (
                <a 
                  href={item.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
