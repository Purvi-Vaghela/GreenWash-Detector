import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Leaf, Building2, Mail, Lock, Hash, Factory, ArrowLeft } from 'lucide-react';

const INDUSTRY_TYPES = [
  'Manufacturing',
  'Technology',
  'Energy & Utilities',
  'Mining & Metals',
  'Chemicals',
  'Pharmaceuticals',
  'Food & Beverage',
  'Textiles',
  'Automotive',
  'Construction',
  'Agriculture',
  'Logistics & Transport',
  'Other'
];

export default function Register() {
  const [formData, setFormData] = useState({
    gst_number: '',
    email: '',
    company_name: '',
    industry_type: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.gst_number || !formData.email || !formData.company_name || 
        !formData.industry_type || !formData.password || !formData.confirm_password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // GST validation (basic - 15 characters)
    if (formData.gst_number.length < 15) {
      setError('Please enter a valid 15-character GST number');
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Register Your Company</h1>
          <p className="text-gray-600 mt-2">Create an account to access ESG auditing</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition uppercase"
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">15-character GST Identification Number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Your Company Pvt Ltd"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
              <div className="relative">
                <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="industry_type"
                  value={formData.industry_type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none bg-white"
                >
                  <option value="">Select Industry</option>
                  {INDUSTRY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Register Company'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
