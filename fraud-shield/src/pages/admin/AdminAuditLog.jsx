import { useState } from 'react';
import { ClipboardList, Search, Shield, CreditCard, Users, Settings, AlertTriangle } from 'lucide-react';
import Navigation from '../../components/Navigation';

const LOGS = [
  { id: 1, actor: 'admin@fraud.com', role: 'admin', action: 'block_transaction', resource: 'transaction', resourceId: 'TXN-8821', detail: 'Manually blocked — high risk score 92%', ip: '103.21.x.x', time: '2 min ago' },
  { id: 2, actor: 'analyst@fraud.com', role: 'analyst', action: 'update_alert_status', resource: 'alert', resourceId: 'ALT-003', detail: 'Status changed: new → investigating', ip: '103.21.x.x', time: '15 min ago' },
  { id: 3, actor: 'admin@fraud.com', role: 'admin', action: 'suspend_user', resource: 'user', resourceId: 'user-005', detail: 'Account suspended — confirmed fraud', ip: '103.21.x.x', time: '1h ago' },
  { id: 4, actor: 'admin@fraud.com', role: 'admin', action: 'update_rule', resource: 'rule', resourceId: 'RUL-001', detail: 'Velocity threshold changed: 10 → 8 transactions', ip: '103.21.x.x', time: '2h ago' },
  { id: 5, actor: 'analyst@fraud.com', role: 'analyst', action: 'add_watchlist', resource: 'user', resourceId: 'user-007', detail: 'Added to watchlist: level=monitor', ip: '103.21.x.x', time: '3h ago' },
  { id: 6, actor: 'manager@fraud.com', role: 'manager', action: 'generate_report', resource: 'report', resourceId: 'RPT-004', detail: 'Monthly Fraud Analysis Report generated', ip: '45.113.x.x', time: '4h ago' },
  { id: 7, actor: 'admin@fraud.com', role: 'admin', action: 'approve_transaction', resource: 'transaction', resourceId: 'TXN-8815', detail: 'Manual override — legitimate transaction confirmed', ip: '103.21.x.x', time: '5h ago' },
  { id: 8, actor: 'analyst@fraud.com', role: 'analyst', action: 'close_case', resource: 'case', resourceId: 'CASE-003', detail: 'Resolved as false positive', ip: '103.21.x.x', time: '6h ago' },
];

const resourceIcon = {
  transaction: CreditCard,
  alert: AlertTriangle,
  user: Users,
  rule: Settings,
  report: ClipboardList,
  case: Shield,
};

const actionColor = {
  block_transaction: 'text-red-500',
  suspend_user: 'text-red-500',
  approve_transaction: 'text-green-500',
  update_rule: 'text-blue-500',
  update_alert_status: 'text-amber-500',
  add_watchlist: 'text-amber-500',
  generate_report: 'text-purple-500',
  close_case: 'text-green-500',
};

export default function AdminAuditLog() {
  const [search, setSearch] = useState('');
  const [filterResource, setFilterResource] = useState('all');

  const filtered = LOGS.filter(l => {
    const matchSearch = l.actor.includes(search) || l.action.includes(search) || l.resourceId.includes(search);
    const matchFilter = filterResource === 'all' || l.resource === filterResource;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="text-sm text-gray-500">Complete record of all admin and analyst actions with timestamps</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search by actor, action, or resource ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {['all', 'transaction', 'alert', 'user', 'rule', 'case', 'report'].map(r => (
              <button key={r} onClick={() => setFilterResource(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filterResource === r ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {r}
              </button>
            ))}
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-3">Actor</th>
                <th className="text-left pb-3">Action</th>
                <th className="text-left pb-3">Resource</th>
                <th className="text-left pb-3">Detail</th>
                <th className="text-left pb-3">IP</th>
                <th className="text-right pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map(log => {
                const Icon = resourceIcon[log.resource] || ClipboardList;
                const color = actionColor[log.action] || 'text-gray-500';
                return (
                  <tr key={log.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{log.actor}</p>
                      <span className="badge-info text-[10px]">{log.role}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-mono font-medium ${color}`}>{log.action}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{log.resource}</span>
                        <span className="text-xs font-mono text-gray-400">#{log.resourceId}</span>
                      </div>
                    </td>
                    <td className="py-3 max-w-xs">
                      <p className="text-xs text-gray-500 truncate">{log.detail}</p>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-400 font-mono">{log.ip}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-xs text-gray-400">{log.time}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
