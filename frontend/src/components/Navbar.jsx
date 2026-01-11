import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, LogOut, Shield, Building2, Info, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">GreenWash Detector</h1>
              <p className="text-xs text-gray-500">ESG Audit Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/co2-report"
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              CO₂ Report
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition text-sm"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              {user?.role === 'admin' ? (
                <Shield className="w-4 h-4 text-blue-600" />
              ) : (
                <Building2 className="w-4 h-4 text-emerald-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.role === 'admin' ? 'Govt Admin' : 'Industry'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
