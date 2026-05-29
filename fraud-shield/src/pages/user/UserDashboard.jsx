import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Smartphone, TrendingUp, CheckCircle, Activity, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

const txData = [
  { time: '00:00', blocked: 0, flagged: 0, approved: 2 },
  { time: '04:00', blocked: 0, flagged: 0, approved: 1 },
  { time: '08:00', blocked: 0, flagged: 0, approved: 5 },
  { time: '12:00', blocked: 1, flagged: 0, approved: 8 },
  { time: '16:00', blocked: 0, flagged: 0, approved: 3 },
  { time: '20:00', blocked: 0, flagged: 0, approved: 0 },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const { getUserData, isDemoAccount } = useUserData();
  const navigate = useNavigate();
  const data = getUserData(user?.id);
  const isDemo = isDemoAccount(user?.id);

  if (!isDemo && data.transactions.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}! 👋</h1>
            <p className="text-sm text-gray-500">Get started with fraud protection for your account</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <div className="card p-6 text-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 border-2 border-transparent transition-all" onClick={() => navigate('/user/manual-check')}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield size={22} className="text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Check a Transaction</h3>
              <p className="text-xs text-gray-400 mb-3">Verify if a transaction is safe before proceeding</p>
              <button className="btn-primary text-xs py-1.5 w-full">Check Now</button>
            </div>
            <div className="card p-6 text-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 border-2 border-transparent transition-all" onClick={() => navigate('/user/devices')}>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Smartphone size={22} className="text-green-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Manage Devices</h3>
              <p className="text-xs text-gray-400 mb-3">Add and manage trusted devices for your account</p>
              <button className="btn-secondary text-xs py-1.5 w-full">Add Device</button>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 max-w-xl text-xs text-blue-700 dark:text-blue-300">
            💡 Start by checking a transaction to build your fraud protection history, or add your trusted devices.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
          <p className="text-sm text-gray-500">Monitor your account security and transaction activity</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Transactions (30d)', value: data.transactions.length, change: '+12.3%', icon: CreditCard, color: 'bg-blue-500' },
            { label: 'Blocked Transactions', value: data.transactions.filter(t => t.status === 'blocked').length, change: '0%', icon: Shield, color: 'bg-red-500' },
            { label: 'Your Risk Score', value: `${data.riskScore}%`, change: '-2.1%', icon: TrendingUp, color: data.riskScore >= 60 ? 'bg-red-500' : data.riskScore >= 30 ? 'bg-amber-500' : 'bg-green-500' },
            { label: 'Active Devices', value: data.devices.length, change: '0%', icon: Smartphone, color: 'bg-purple-500' },
          ].map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-400">{label}</p>
                <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center`}><Icon size={13} className="text-white" /></div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{change} vs last hour</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Transaction activity (24h)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={txData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="approved" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="flagged" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account Status</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Account Secure', desc: 'No suspicious activity detected', color: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-400', icon: CheckCircle },
                { label: 'Protection Active', desc: 'Real-time fraud monitoring enabled', color: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-700 dark:text-blue-400', icon: Shield },
                { label: 'Last Activity', desc: '2 minutes ago from iPhone', color: 'bg-gray-50 dark:bg-gray-700', textColor: 'text-gray-700 dark:text-gray-300', icon: Activity },
              ].map(({ label, desc, color, textColor, icon: Icon }) => (
                <div key={label} className={`flex items-center gap-3 p-3 ${color} rounded-lg`}>
                  <Icon size={14} className={textColor} />
                  <div>
                    <p className={`text-xs font-medium ${textColor}`}>{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Alerts</h3>
            <div className="space-y-2">
              {[
                { icon: AlertTriangle, label: 'New device login', sub: 'MacBook Pro – New York, US', time: '2 days ago', color: 'text-amber-500' },
                { icon: CheckCircle, label: 'Transaction verified', sub: '₹1,250 at Amazon', time: '5 days ago', color: 'text-green-500' },
              ].map(({ icon: Icon, label, sub, time, color }) => (
                <div key={label} className="flex items-start gap-2 p-2.5 border border-gray-100 dark:border-gray-700 rounded-lg">
                  <Icon size={14} className={`${color} mt-0.5 shrink-0`} />
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-500">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Security Tips</h3>
            <div className="space-y-2">
              {[
                { title: 'Enable Two-Factor Authentication', sub: 'Add an extra layer of security to your account' },
                { title: 'Review Your Devices', sub: 'Check for any unfamiliar devices' },
                { title: 'Monitor Transactions', sub: 'Report any suspicious activity immediately' },
              ].map(({ title, sub }) => (
                <div key={title} className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
