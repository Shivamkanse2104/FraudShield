import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Navigation from '../../components/Navigation';

const trendData = [
  { month: 'Jan', detected: 120, prevented: 110, fp: 12 },
  { month: 'Feb', detected: 145, prevented: 138, fp: 9 },
  { month: 'Mar', detected: 189, prevented: 180, fp: 8 },
  { month: 'Apr', detected: 162, prevented: 155, fp: 7 },
  { month: 'May', detected: 175, prevented: 168, fp: 6 },
  { month: 'Jun', detected: 148, prevented: 142, fp: 5 },
];

const riskDist = [
  { range: '0-20', count: 3200 }, { range: '21-40', count: 820 },
  { range: '41-60', count: 340 }, { range: '61-80', count: 180 },
  { range: '81-100', count: 91 },
];

const volumeData = [
  { time: '00:00', legitimate: 42, fraud: 2 }, { time: '04:00', legitimate: 18, fraud: 1 },
  { time: '08:00', legitimate: 280, fraud: 8 }, { time: '12:00', legitimate: 460, fraud: 15 },
  { time: '16:00', legitimate: 380, fraud: 12 }, { time: '20:00', legitimate: 290, fraud: 9 },
];

const pieData = [
  { name: 'Card Testing', value: 33, color: '#3B82F6' },
  { name: 'Account Takeover', value: 25, color: '#8B5CF6' },
  { name: 'Identity Theft', value: 18, color: '#EC4899' },
  { name: 'Velocity Abuse', value: 14, color: '#F59E0B' },
  { name: 'Payment Fraud', value: 10, color: '#10B981' },
];

export default function AdminAnalytics() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLastUpdate(new Date()), 3000);
    return () => clearInterval(t);
  }, []);

  const metrics = [
    { label: 'Detection Accuracy', value: '97.8%', change: '+12.3%', up: true, icon: Target },
    { label: 'False Positive Rate', value: '1.2%', change: '-8.7%', up: false, icon: Activity },
    { label: 'Fraud Prevented (30d)', value: '₹2.4M', change: '+15.2%', up: true, icon: TrendingUp },
    { label: 'Avg Response Time', value: '0.3s', change: '+23.4%', up: true, icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Deep insights into fraud patterns and system performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot" />
              Live
            </div>
            <span className="text-xs text-gray-400">Last update: {lastUpdate.toLocaleTimeString()}</span>
            <select className="input text-xs py-1.5 w-36">
              <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {metrics.map(({ label, value, change, up, icon: Icon }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className="text-gray-400" />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-green-500' : 'text-red-500'}`}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Fraud Attempts Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="det" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="detected" stroke="#3B82F6" fill="url(#det)" strokeWidth={2} name="blocked" />
                <Area type="monotone" dataKey="prevented" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} name="approved" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Fraud Type Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{d.name}: <strong>{d.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Risk Score Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={riskDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Transaction Volume by Time</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend />
                <Line type="monotone" dataKey="legitimate" stroke="#10B981" strokeWidth={2} dot={false} name="legitimate" />
                <Line type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={2} dot={false} name="fraud" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
