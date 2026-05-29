import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);   // ← was missing await
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fraud Shield</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Secure fraud detection platform</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className="input pl-9" placeholder="admin@fraud.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" className="input pl-9" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-blue-600 dark:text-blue-300">
            <div>👤 Admin: admin@fraud.com / admin123</div>
            <div>👤 User: user@fraud.com / user123</div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">Register here</Link>
        </p>
      </div>
    </div>
  );
}
