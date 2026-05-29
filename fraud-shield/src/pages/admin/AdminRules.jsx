import { useState } from 'react';
import { Plus, Search, Power, Pencil, Trash2 } from 'lucide-react';
import Navigation from '../../components/Navigation';

const RULES = [
  { id: 'R001', name: 'High Velocity Transactions', category: 'velocity', action: 'block', priority: 'High Priority', desc: 'Blocks users making more than 10 transactions in 5 minutes', condition: 'transactions > 10 in 5 minutes', triggered: 234, lastTriggered: '2 hours ago', active: true },
  { id: 'R002', name: 'Large Transaction Amount', category: 'amount', action: 'flag', priority: null, desc: 'Flags transactions over ₹10,000', condition: 'amount > ₹10,000', triggered: 89, lastTriggered: 'Never', active: true },
  { id: 'R003', name: 'Suspicious Location Change', category: 'location', action: 'block', priority: 'High Priority', desc: 'Detects rapid geographic location changes', condition: 'location change > 500 miles in 1 hour', triggered: 156, lastTriggered: '1 hour ago', active: true },
  { id: 'R004', name: 'Failed Login Attempts', category: 'pattern', action: 'block', priority: 'High Priority', desc: 'Blocks account after 5 failed login attempts', condition: 'failed_logins > 5 in 10 minutes', triggered: 67, lastTriggered: '30 minutes ago', active: true },
  { id: 'R005', name: 'New Device Detection', category: 'device', action: 'review', priority: null, desc: 'Requires verification for new device logins', condition: 'device not recognised', triggered: 342, lastTriggered: '5 minutes ago', active: true },
  { id: 'R006', name: 'Unusual Transaction Pattern', category: 'pattern', action: 'flag', priority: null, desc: 'Detects transactions outside normal user behavior', condition: 'deviation > 3 standard deviations', triggered: 45, lastTriggered: '3 hours ago', active: false },
];

const catColor = { velocity: 'badge-warning', amount: 'badge-info', location: 'badge-danger', pattern: 'badge-info', device: 'badge-success' };
const actColor = { block: 'badge-danger', flag: 'badge-warning', review: 'badge-info' };

export default function AdminRules() {
  const [rules, setRules] = useState(RULES);
  const [search, setSearch] = useState('');

  const toggle = (id) => setRules(r => r.map(x => x.id === id ? { ...x, active: !x.active } : x));

  const filtered = rules.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  const active = rules.filter(r => r.active).length;
  const totalTriggers = rules.reduce((s, r) => s + r.triggered, 0);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rules Engine</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure and manage fraud detection rules</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Create Rule
          </button>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search rules..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Power size={14} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{active}</span>
              <span className="text-xs text-gray-500">Active Rules</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Power size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{totalTriggers}</span>
              <span className="text-xs text-gray-500">Total Triggers</span>
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map(rule => (
              <div key={rule.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{rule.name}</span>
                    <span className={catColor[rule.category]}>{rule.category}</span>
                    <span className={actColor[rule.action]}>{rule.action}</span>
                    {rule.priority && <span className="badge-danger">{rule.priority}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(rule.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${rule.active ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600"><Pencil size={14} /></button>
                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{rule.desc}</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400 mb-1">Condition</p>
                    <p className="font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{rule.condition}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Triggered</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{rule.triggered} times</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Last Triggered</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{rule.lastTriggered}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
