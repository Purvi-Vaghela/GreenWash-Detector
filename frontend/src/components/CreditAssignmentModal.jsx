import { useState } from 'react';
import { X, Award, Leaf, Droplets, Recycle, Zap } from 'lucide-react';

const CREDIT_TYPES = [
  { id: 'CO2', label: 'CO2 Credits', icon: Leaf, color: 'emerald' },
  { id: 'Renewable', label: 'Renewable Energy', icon: Zap, color: 'amber' },
  { id: 'Water', label: 'Water Conservation', icon: Droplets, color: 'blue' },
  { id: 'Waste', label: 'Waste Reduction', icon: Recycle, color: 'purple' },
];

export default function CreditAssignmentModal({ company, onClose, onAssign, loading }) {
  const [creditType, setCreditType] = useState('CO2');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !reason) return;
    
    onAssign({
      user_id: company.id,
      credit_type: creditType,
      amount: parseFloat(amount),
      reason,
      valid_until: validUntil ? new Date(validUntil).toISOString() : null
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Assign Credits</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600">Assigning to:</p>
            <p className="font-semibold text-blue-900">{company.company_name}</p>
            <p className="text-xs text-blue-600">{company.gst_number}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credit Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CREDIT_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = creditType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setCreditType(type.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? `border-${type.color}-500 bg-${type.color}-50` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? `text-${type.color}-600` : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${isSelected ? `text-${type.color}-700` : 'text-gray-600'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter credit amount"
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for credit assignment..."
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (Optional)</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || !reason}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign Credit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
