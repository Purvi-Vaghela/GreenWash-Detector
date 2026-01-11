import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, loginAdmin } from '../services/api';
import { Leaf, Shield, Building2, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let userData;
      if (role === 'admin') {
        userData = await loginAdmin(email, password);
      } else {
        userData = await loginUser(email, password);
      }
      login(userData);
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GreenWash Detector</h1>
          <p className="text-gray-600 mt-2">AI-Powered ESG Audit Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRole('client')}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                role === 'client' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Industry
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                role === 'admin' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-5 h-5" />
              Govt Admin
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 ${
                role === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? 'Signing in...' : `Sign In as ${role === 'admin' ? 'Government Official' : 'Industry Client'}`}
            </button>
          </form>

          {role === 'client' && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                Register your company
              </Link>
            </p>
          )}

          {role === 'admin' && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Government official?{' '}
              <Link to="/admin/register" className="text-blue-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
