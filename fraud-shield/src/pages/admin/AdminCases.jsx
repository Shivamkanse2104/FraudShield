import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, AlertTriangle, Clock, CheckCircle, TrendingUp, Plus, Search, User } from 'lucide-react';
import Navigation from '../../components/Navigation';

const CASES = [
  { id: 'CASE-001', title: 'Multiple high-velocity transactions — Robert Brown', priority: 'critical', status: 'open', fraudType: 'velocity_abuse', riskScore: 92, assignedTo: 'analyst@fraud.com', created: '10 min ago', sla: '1h 50m left' },
  { id: 'CASE-002', title: 'Impossible travel pattern — Mike Johnson', priority: 'high', status: 'in_progress', fraudType: 'account_takeover', riskScore: 85, assignedTo: 'analyst@fraud.com', created: '1h ago', sla: '6h 30m left' },
  { id: 'CASE-003', title: 'Card-not-present fraud — Emily Davis', priority: 'medium', status: 'in_progress', fraudType: 'card_not_present', riskScore: 72, assignedTo: null, created: '3h ago', sla: '21h left' },
  { id: 'CASE-004', title: 'Suspected identity fraud — David Miller', priority: 'high', status: 'open', fraudType: 'identity_fraud', riskScore: 78, assignedTo: null, created: '5h ago', sla: '3h left' },
  { id: 'CASE-005', title: 'Duplicate transaction dispute — Jane Smith', priority: 'low', status: 'resolved', fraudType: 'duplicate', riskScore: 22, assignedTo: 'analyst@fraud.com', created: '1d ago', sla: 'Resolved' },
];

const priorityConfig = {
  critical: { cls: 'badge-danger', dot: 'bg-red-500' },
  high: { cls: 'badge-warning', dot: 'bg-amber-500' },
  medium: { cls: 'badge-info', dot: 'bg-blue-500' },
  low: { cls: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full', dot: 'bg-gray-400' },
};

const statusConfig = {
  open: 'badge-warning',
  in_progress: 'badge-info',
  resolved: 'badge-success',
  closed: 'bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full',
};

export default function AdminCases() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const stats = { total: CASES.length, open: CASES.filter(c => c.status === 'open').length, in_progress: CASES.filter(c => c.status === 'in_progress').length, critical: CASES.filter(c => c.priority === 'critical').length };

  const filtered = CASES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter || c.priority === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Case Management</h1>
            <p className="text-sm text-gray-500">Prioritised fraud investigation queue</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} /> New Case</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Cases', value: stats.total, icon: Briefcase, color: 'bg-blue-500' },
            { label: 'Open', value: stats.open, icon: AlertTriangle, color: 'bg-amber-500' },
            { label: 'In Progress', value: stats.in_progress, icon: Clock, color: 'bg-purple-500' },
            { label: 'Critical SLA', value: stats.critical, icon: TrendingUp, color: 'bg-red-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {['all','open','in_progress','critical','resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {f.replace('_',' ')}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(c => {
              const pCfg = priorityConfig[c.priority];
              return (
                <div key={c.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer" onClick={() => navigate(`/admin/alert-investigation?id=${c.id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${pCfg.dot}`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.title}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span className={pCfg.cls}>{c.priority}</span>
                      <span className={statusConfig[c.status]}>{c.status.replace('_',' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="font-mono">{c.id}</span>
                    <span className="badge-info">{c.fraudType.replace(/_/g,' ')}</span>
                    <span className={`font-semibold ${c.riskScore >= 80 ? 'text-red-500' : c.riskScore >= 60 ? 'text-amber-500' : 'text-green-500'}`}>Risk: {c.riskScore}%</span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock size={10} /> SLA: {c.sla}
                    </span>
                    {c.assignedTo
                      ? <span className="flex items-center gap-1"><User size={10}/>{c.assignedTo}</span>
                      : <span className="text-amber-500">Unassigned</span>}
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
