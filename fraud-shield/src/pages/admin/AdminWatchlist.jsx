import { useState } from 'react';
import { Eye, Plus, Trash2, Search, AlertTriangle, Users, Network, Shield } from 'lucide-react';
import Navigation from '../../components/Navigation';

const WATCHLIST = [
  { id: 'W001', userId: 'user-005', name: 'Robert Brown', email: 'robert@example.com', level: 'blocked', reason: 'Confirmed fraud — multiple blocked transactions', addedBy: 'admin@fraud.com', addedAt: 'Apr 14, 2026', riskScore: 92 },
  { id: 'W002', userId: 'user-003', name: 'Mike Johnson', email: 'mike@example.com', level: 'high_risk', reason: 'Suspicious velocity patterns — under investigation', addedBy: 'analyst@fraud.com', addedAt: 'Apr 15, 2026', riskScore: 78 },
  { id: 'W003', userId: 'user-007', name: 'David Miller', email: 'david@example.com', level: 'monitor', reason: 'Unusual location changes — monitoring for 30 days', addedBy: 'admin@fraud.com', addedAt: 'Apr 16, 2026', riskScore: 65 },
  { id: 'W004', userId: 'user-012', name: 'Raj Patel', email: 'raj@example.com', level: 'monitor', reason: 'Linked to flagged network — passive monitoring', addedBy: 'analyst@fraud.com', addedAt: 'Apr 17, 2026', riskScore: 55 },
];

const NETWORK_LINKS = [
  { from: 'Robert Brown', to: 'Mike Johnson', type: 'Shared IP', risk: 'high' },
  { from: 'Mike Johnson', to: 'David Miller', type: 'Same device', risk: 'medium' },
  { from: 'Robert Brown', to: 'Raj Patel', type: 'Shared merchant', risk: 'medium' },
];

const levelCfg = {
  blocked:   { cls: 'badge-danger', label: 'Blocked' },
  high_risk: { cls: 'badge-warning', label: 'High Risk' },
  monitor:   { cls: 'badge-info', label: 'Monitor' },
};

export default function AdminWatchlist() {
  const [search, setSearch] = useState('');
  const [list, setList] = useState(WATCHLIST);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ userId: '', name: '', email: '', level: 'monitor', reason: '' });

  const filtered = list.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const remove = (id) => setList(l => l.filter(e => e.id !== id));

  const add = () => {
    if (!newEntry.name || !newEntry.reason) return;
    setList(l => [...l, { id: `W00${l.length + 1}`, ...newEntry, addedBy: 'admin@fraud.com', addedAt: 'Just now', riskScore: 50 }]);
    setShowAdd(false);
    setNewEntry({ userId: '', name: '', email: '', level: 'monitor', reason: '' });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Watchlist & Network Analysis</h1>
            <p className="text-sm text-gray-500">Monitor high-risk users and related account networks</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={14} /> Add to Watchlist
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Monitored Users', value: list.length, icon: Eye, color: 'bg-blue-500' },
            { label: 'High Risk', value: list.filter(e => e.level === 'high_risk').length, icon: AlertTriangle, color: 'bg-amber-500' },
            { label: 'Blocked', value: list.filter(e => e.level === 'blocked').length, icon: Shield, color: 'bg-red-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Watchlist table */}
          <div className="col-span-2 card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="input pl-9 text-sm" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map(entry => {
                const cfg = levelCfg[entry.level];
                return (
                  <div key={entry.id} className="flex items-start justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mt-0.5">
                        <Users size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</p>
                          <span className={cfg.cls}>{cfg.label}</span>
                          <span className={`text-xs font-semibold ${entry.riskScore >= 80 ? 'text-red-500' : entry.riskScore >= 60 ? 'text-amber-500' : 'text-blue-500'}`}>Risk: {entry.riskScore}%</span>
                        </div>
                        <p className="text-xs text-gray-400">{entry.email}</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">{entry.reason}</p>
                        <p className="text-xs text-gray-300 dark:text-gray-500 mt-0.5">Added by {entry.addedBy} · {entry.addedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="input text-xs py-1 w-28" defaultValue={entry.level}>
                        <option value="monitor">Monitor</option>
                        <option value="high_risk">High Risk</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <button onClick={() => remove(entry.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network graph (simplified) */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Network size={14} /> Network Links
            </h3>
            <p className="text-xs text-gray-400 mb-3">Connections detected between monitored accounts</p>
            <div className="space-y-2">
              {NETWORK_LINKS.map((link, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 ${link.risk === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-amber-500 bg-amber-50 dark:bg-amber-900/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={link.risk === 'high' ? 'badge-danger' : 'badge-warning'}>{link.type}</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{link.from}</span>
                    <span className="text-gray-400 mx-1">↔</span>
                    <span className="font-medium">{link.to}</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400">Money mule detection: shared IPs, devices, or merchants between flagged accounts signal coordinated fraud rings.</p>
            </div>
          </div>
        </div>

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="card p-6 w-full max-w-md">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Add to Watchlist</h3>
              <div className="space-y-3">
                {[
                  { label: 'User ID', key: 'userId', placeholder: 'user-001' },
                  { label: 'Name', key: 'name', placeholder: 'John Doe' },
                  { label: 'Email', key: 'email', placeholder: 'john@example.com' },
                  { label: 'Reason', key: 'reason', placeholder: 'Explain why this user is being watched' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                    <input className="input text-sm" placeholder={placeholder} value={newEntry[key]}
                      onChange={e => setNewEntry(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Watch Level</label>
                  <select className="input text-sm" value={newEntry.level} onChange={e => setNewEntry(p => ({ ...p, level: e.target.value }))}>
                    <option value="monitor">Monitor</option>
                    <option value="high_risk">High Risk</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm flex-1">Cancel</button>
                <button onClick={add} className="btn-primary text-sm flex-1">Add to Watchlist</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
