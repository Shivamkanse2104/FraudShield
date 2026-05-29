import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);  // ← was missing await
    setLoading(false);
    if (result.success) navigate('/user/dashboard', { replace: true });
    else setError(result.error);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Fraud Shield platform</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'john@example.com' },
              { name: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
              { name: 'confirm', label: 'Confirm Password', icon: Lock, type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, icon: Icon, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={type} name={name} className="input pl-9" placeholder={placeholder} value={form[name]} onChange={handleChange} required />
                </div>
              </div>
            ))}
            {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-blue-600 dark:text-blue-300">
          New accounts receive user-level access. Contact admin for elevated permissions.
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
