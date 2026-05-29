import { useNavigate } from 'react-router-dom';
import { Users, ShieldAlert, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Navigation from '../../components/Navigation';

const txData = [
  { time: '00:00', blocked: 12, flagged: 8, approved: 120 },
  { time: '04:00', blocked: 5, flagged: 3, approved: 60 },
  { time: '08:00', blocked: 25, flagged: 18, approved: 280 },
  { time: '12:00', blocked: 45, flagged: 32, approved: 520 },
  { time: '16:00', blocked: 38, flagged: 24, approved: 480 },
  { time: '20:00', blocked: 22, flagged: 15, approved: 310 },
];

const riskData = [
  { level: 'Low', count: 3200 }, { level: 'Medium', count: 820 },
  { level: 'High', count: 340 }, { level: 'Critical', count: 91 },
];

const recentTx = [
  { id: 'TXN-8821', user: 'Mike Johnson', amount: 45000, status: 'blocked', risk: 85 },
  { id: 'TXN-8820', user: 'Sarah Williams', amount: 1250, status: 'approved', risk: 12 },
  { id: 'TXN-8819', user: 'Robert Brown', amount: 21000, status: 'flagged', risk: 72 },
  { id: 'TXN-8818', user: 'Emily Davis', amount: 450, status: 'approved', risk: 8 },
  { id: 'TXN-8817', user: 'David Miller', amount: 8900, status: 'flagged', risk: 65 },
];

const systemStatus = [
  { name: 'Detection Engine', desc: 'All systems operational', status: 'ok' },
  { name: 'Transaction Processing', desc: 'Processing at 99.9% uptime', status: 'ok' },
  { name: 'ML Model', desc: 'Retraining scheduled in 2h', status: 'warn' },
  { name: 'Database', desc: 'Healthy, 12ms avg latency', status: 'ok' },
];

const topRiskUsers = [
  { id: 'user-4521', txCount: 4, risk: 85 },
  { id: 'user-8932', txCount: 3, risk: 80 },
  { id: 'user-2341', txCount: 2, risk: 75 },
  { id: 'user-6754', txCount: 1, risk: 70 },
];

function MetricCard({ label, value, change, positive, icon: Icon, iconColor }) {
  const up = positive ? change >= 0 : change < 0;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{Math.abs(change)}% vs last hour</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'approved') return <span className="badge-success flex items-center gap-1"><CheckCircle size={10} />Approved</span>;
  if (status === 'flagged')  return <span className="badge-warning flex items-center gap-1"><AlertTriangle size={10} />Flagged</span>;
  return <span className="badge-danger flex items-center gap-1"><XCircle size={10} />Blocked</span>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Complete system overview and analytics</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard label="Total Users" value="1,247" change={8.2} positive icon={Users} iconColor="bg-blue-500" />
          <MetricCard label="Blocked Today" value="91" change={12.5} positive icon={ShieldAlert} iconColor="bg-red-500" />
          <MetricCard label="Fraud Rate" value="2.8%" change={-5.3} positive={false} icon={AlertTriangle} iconColor="bg-amber-500" />
          <MetricCard label="Amount Saved (30d)" value="₹345k" change={18.7} positive icon={DollarSign} iconColor="bg-green-500" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Transaction activity (24h)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={txData}>
                <defs>
                  <linearGradient id="approved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="approved" stroke="#10B981" fill="url(#approved)" strokeWidth={2} />
                <Area type="monotone" dataKey="flagged" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">System Status</h3>
            <div className="space-y-2 mt-4">
              {systemStatus.map(s => (
                <div key={s.name} className={`flex items-center justify-between p-3 rounded-lg ${s.status === 'ok' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                  <div>
                    <p className={`text-sm font-medium ${s.status === 'ok' ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>{s.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full pulse-dot ${s.status === 'ok' ? 'bg-green-500' : 'bg-amber-500'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Top Risk Users */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Users size={14} /> Top Risk Users
            </h3>
            <div className="space-y-2">
              {topRiskUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{u.id}</p>
                    <p className="text-xs text-gray-400">{u.txCount} flagged transactions</p>
                  </div>
                  <span className="badge-danger font-bold">{u.risk}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle size={14} /> Recent Alerts
            </h3>
            <div className="space-y-2">
              {['Velocity Alert', 'Location Alert', 'High Risk Alert', 'Pattern Alert'].map((a, i) => (
                <div key={a} className="flex items-center gap-2 py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{a}</p>
                    <p className="text-xs text-gray-400">{(i + 1) * 7}m ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity size={14} /> Performance
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Detection Accuracy', value: 97.8, color: 'bg-green-500' },
                { label: 'False Positive Rate', value: 1.2, color: 'bg-blue-500' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">{m.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className={`h-1.5 ${m.color} rounded-full`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-1">
                <p className="text-xs text-gray-500">Response Time</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">45ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button onClick={() => navigate('/admin/transactions')} className="text-xs text-blue-500 hover:text-blue-600 font-medium">View all →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-2">Transaction ID</th>
                <th className="text-left pb-2">User</th>
                <th className="text-right pb-2">Amount</th>
                <th className="text-center pb-2">Status</th>
                <th className="text-right pb-2">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {recentTx.map(tx => (
                <tr key={tx.id} className="text-sm">
                  <td className="py-2.5 font-mono text-xs text-gray-500">{tx.id}</td>
                  <td className="py-2.5 text-gray-700 dark:text-gray-300">{tx.user}</td>
                  <td className="py-2.5 text-right font-medium text-gray-900 dark:text-white">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-2.5 text-center"><StatusBadge status={tx.status} /></td>
                  <td className="py-2.5 text-right">
                    <span className={`font-semibold text-xs ${tx.risk >= 80 ? 'text-red-500' : tx.risk >= 60 ? 'text-amber-500' : 'text-green-500'}`}>{tx.risk}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
