import { useState, useEffect } from 'react';
import { Server, Activity, Database, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navigation from '../../components/Navigation';

function generateMetrics() {
  return {
    latency: Math.floor(Math.random() * 40) + 20,
    throughput: Math.floor(Math.random() * 200) + 800,
    errorRate: (Math.random() * 0.5).toFixed(2),
    cpuUsage: Math.floor(Math.random() * 30) + 40,
    memUsage: Math.floor(Math.random() * 20) + 55,
    dbLatency: Math.floor(Math.random() * 8) + 8,
    queueDepth: Math.floor(Math.random() * 50) + 10,
  };
}

const SERVICES = [
  { name: 'Fraud Detection API', status: 'healthy', uptime: '99.98%', latency: '28ms' },
  { name: 'ML Inference Engine', status: 'healthy', uptime: '99.95%', latency: '310ms' },
  { name: 'Transaction Processor', status: 'healthy', uptime: '99.99%', latency: '12ms' },
  { name: 'Alert Engine', status: 'degraded', uptime: '99.71%', latency: '145ms' },
  { name: 'PostgreSQL Primary', status: 'healthy', uptime: '100%', latency: '10ms' },
  { name: 'Redis Cache', status: 'healthy', uptime: '99.99%', latency: '2ms' },
  { name: 'Notification Service', status: 'healthy', uptime: '99.89%', latency: '55ms' },
  { name: 'Report Generator', status: 'maintenance', uptime: 'Maintenance', latency: '—' },
];

export default function AdminSystemHealth() {
  const [metrics, setMetrics] = useState(generateMetrics());
  const [history, setHistory] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: `${i * 3}s`, ...generateMetrics() }))
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const m = generateMetrics();
      setMetrics(m);
      setTick(t => t + 1);
      setHistory(h => [...h.slice(-19), { t: `now`, ...m }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    healthy: { cls: 'text-green-500', bg: 'bg-green-500', label: 'Healthy', dot: 'bg-green-500' },
    degraded: { cls: 'text-amber-500', bg: 'bg-amber-500', label: 'Degraded', dot: 'bg-amber-500' },
    maintenance: { cls: 'text-blue-500', bg: 'bg-blue-500', label: 'Maintenance', dot: 'bg-blue-500' },
    down: { cls: 'text-red-500', bg: 'bg-red-500', label: 'Down', dot: 'bg-red-500' },
  };

  const overallHealthy = SERVICES.every(s => s.status === 'healthy' || s.status === 'maintenance');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">System Health Monitor</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
              <p className="text-sm text-gray-500">Live — auto-refreshing every 3s</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${overallHealthy ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
            {overallHealthy ? <><CheckCircle size={14} /> All Systems Operational</> : <><AlertTriangle size={14} /> Partial Degradation</>}
          </div>
        </div>

        {/* Live KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: 'API Latency', value: `${metrics.latency}ms`, icon: Zap, good: metrics.latency < 50, sub: metrics.latency < 50 ? '↓ Normal' : '↑ High' },
            { label: 'Throughput', value: `${metrics.throughput}/s`, icon: Activity, good: true, sub: 'Transactions/sec' },
            { label: 'Error Rate', value: `${metrics.errorRate}%`, icon: AlertTriangle, good: Number(metrics.errorRate) < 0.3, sub: Number(metrics.errorRate) < 0.3 ? 'Within SLA' : 'Above SLA' },
            { label: 'DB Latency', value: `${metrics.dbLatency}ms`, icon: Database, good: metrics.dbLatency < 20, sub: 'PostgreSQL avg' },
          ].map(({ label, value, icon: Icon, good, sub }) => (
            <div key={label} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-400">{label}</p>
                <Icon size={14} className={good ? 'text-green-500' : 'text-amber-500'} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className={`text-xs mt-1 font-medium ${good ? 'text-green-500' : 'text-amber-500'}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">API Latency (ms)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="latency" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Throughput (tx/sec)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource usage */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'CPU Usage', value: metrics.cpuUsage, color: metrics.cpuUsage > 80 ? 'bg-red-500' : metrics.cpuUsage > 60 ? 'bg-amber-500' : 'bg-blue-500' },
            { label: 'Memory Usage', value: metrics.memUsage, color: metrics.memUsage > 85 ? 'bg-red-500' : metrics.memUsage > 70 ? 'bg-amber-500' : 'bg-green-500' },
            { label: 'Queue Depth', value: Math.min(metrics.queueDepth, 100), color: metrics.queueDepth > 80 ? 'bg-red-500' : 'bg-purple-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-bold text-gray-900 dark:text-white">{value}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Services table */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Server size={14} /> Service Status
          </h3>
          <div className="space-y-2">
            {SERVICES.map(svc => {
              const cfg = statusConfig[svc.status];
              return (
                <div key={svc.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot} ${svc.status === 'healthy' ? 'pulse-dot' : ''}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <span className="text-gray-400">Uptime: <span className="font-medium text-gray-700 dark:text-gray-300">{svc.uptime}</span></span>
                    <span className="text-gray-400">Latency: <span className="font-medium text-gray-700 dark:text-gray-300">{svc.latency}</span></span>
                    <span className={`font-medium ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
