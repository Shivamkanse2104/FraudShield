import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Activity, Bell, Shield } from 'lucide-react';
import Navigation from '../../components/Navigation';

const ALERTS = [
  { id: 'ALT-001', type: 'velocity', priority: 'high', title: 'Multiple high-risk transactions detected', desc: '5 transactions from same IP address in 10 minutes', time: '2 minutes ago', status: 'new' },
  { id: 'ALT-002', type: 'velocity', priority: 'medium', title: 'Card velocity threshold exceeded', desc: 'Card ****3847 used 8 times in last hour', time: '8 minutes ago', status: 'new' },
  { id: 'ALT-003', type: 'location', priority: 'high', title: 'Impossible travel pattern', desc: 'Card used in NY and CA within 30 minutes', time: '15 minutes ago', status: 'investigating' },
  { id: 'ALT-004', type: 'pattern', priority: 'medium', title: 'Unusual purchase pattern', desc: 'First international transaction for this account', time: '23 minutes ago', status: 'new' },
  { id: 'ALT-005', type: 'device', priority: 'low', title: 'New device login detected', desc: 'User logged in from unrecognized device in Berlin', time: '1 hour ago', status: 'resolved' },
];

const priorityConfig = {
  high: { label: 'High Risk', color: 'border-l-red-500 bg-red-50 dark:bg-red-900/10', badge: 'badge-danger' },
  medium: { label: 'Medium', color: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10', badge: 'badge-warning' },
  low: { label: 'Low', color: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10', badge: 'badge-info' },
};

const typeIcon = { velocity: Activity, location: MapPin, pattern: Activity, device: Shield };

export default function AdminAlerts() {
  const navigate = useNavigate();
  const critical = ALERTS.filter(a => a.priority === 'high').length;
  const medium = ALERTS.filter(a => a.priority === 'medium').length;
  const resolved = ALERTS.filter(a => a.status === 'resolved').length;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Alerts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor and investigate system-wide security alerts</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-1">Critical Alerts</p>
            <p className="text-3xl font-bold text-red-500">{critical}</p>
            <p className="text-xs text-gray-400 mt-1">Require immediate attention</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-1">High Priority</p>
            <p className="text-3xl font-bold text-amber-500">4</p>
            <p className="text-xs text-gray-400 mt-1">Review within 1 hour</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-1">Medium Priority</p>
            <p className="text-3xl font-bold text-blue-500">{medium}</p>
            <p className="text-xs text-gray-400 mt-1">Review when possible</p>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Active alerts</h3>
          <div className="space-y-3">
            {ALERTS.map(alert => {
              const cfg = priorityConfig[alert.priority];
              const Icon = typeIcon[alert.type] || Bell;
              return (
                <div key={alert.id} className={`border-l-4 ${cfg.color} rounded-r-xl p-4 flex items-center justify-between`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</span>
                        <span className={cfg.badge}>{cfg.label}</span>
                        {alert.type !== 'velocity' && <span className="badge-info capitalize">{alert.type}</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{alert.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                  {alert.status !== 'resolved' ? (
                    <button onClick={() => navigate(`/admin/alert-investigation?id=${alert.id}`)} className="btn-primary text-xs py-1.5 px-4 shrink-0 ml-4">Investigate</button>
                  ) : (
                    <span className="badge-success shrink-0 ml-4">Resolved</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
