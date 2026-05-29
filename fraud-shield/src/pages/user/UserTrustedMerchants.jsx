import { useState } from 'react';
import { Shield, Plus, Trash2, Search, CheckCircle, Store } from 'lucide-react';
import Navigation from '../../components/Navigation';

const DEFAULT_MERCHANTS = [
  { id: 'TM-001', name: 'Amazon India', category: 'Retail', addedAt: 'Mar 10, 2026', skipVerification: true },
  { id: 'TM-002', name: 'Flipkart', category: 'Retail', addedAt: 'Mar 15, 2026', skipVerification: true },
  { id: 'TM-003', name: 'Swiggy', category: 'Food', addedAt: 'Apr 1, 2026', skipVerification: false },
];

const CATEGORIES = ['Retail', 'Food', 'Electronics', 'Travel', 'Healthcare', 'Entertainment', 'Utilities', 'Other'];

export default function UserTrustedMerchants() {
  const [merchants, setMerchants] = useState(DEFAULT_MERCHANTS);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saved, setSaved] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Retail', skipVerification: true });

  const filtered = merchants.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const add = () => {
    if (!form.name.trim()) return;
    const newMerchant = {
      id: `TM-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      skipVerification: form.skipVerification,
      addedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setMerchants(p => [...p, newMerchant]);
    setForm({ name: '', category: 'Retail', skipVerification: true });
    setShowAdd(false);
    setSaved('added');
    setTimeout(() => setSaved(null), 2000);
  };

  const remove = (id) => {
    setMerchants(p => p.filter(m => m.id !== id));
    setSaved('removed');
    setTimeout(() => setSaved(null), 2000);
  };

  const toggleSkip = (id) => {
    setMerchants(p => p.map(m => m.id === id ? { ...m, skipVerification: !m.skipVerification } : m));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Trusted Merchants</h1>
            <p className="text-sm text-gray-500">Whitelist merchants to reduce friction on regular purchases</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={14} /> Add Merchant
          </button>
        </div>

        {/* Info banner */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 mb-6 flex items-start gap-3">
          <Shield size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">How trusted merchants work</p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">
              Merchants on your whitelist get lower fraud scrutiny for your transactions. You can optionally skip extra verification steps for merchants you trust completely.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Trusted Merchants', value: merchants.length, color: 'text-blue-600' },
            { label: 'Skip Verification', value: merchants.filter(m => m.skipVerification).length, color: 'text-green-600' },
            { label: 'Fraud Blocks Avoided', value: 12, color: 'text-gray-900 dark:text-white' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search merchants..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                <CheckCircle size={13} /> {saved === 'added' ? 'Merchant added' : 'Merchant removed'}
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Store size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No trusted merchants yet</p>
              <button onClick={() => setShowAdd(true)} className="btn-primary text-xs mt-3">Add your first merchant</button>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Store size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                        <span className="badge-success">Trusted</span>
                        <span className="badge-info">{m.category}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Added {m.addedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-xs text-gray-400 mb-1">Skip verification</p>
                      <button onClick={() => toggleSkip(m.id)} className={`relative w-9 h-4 rounded-full transition-colors ${m.skipVerification ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${m.skipVerification ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <button onClick={() => remove(m.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="card p-6 w-full max-w-sm">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Add Trusted Merchant</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Merchant Name</label>
                  <input className="input text-sm" placeholder="e.g. Amazon, Zomato, BookMyShow" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                  <select className="input text-sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.skipVerification} onChange={e => setForm(p => ({ ...p, skipVerification: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Skip extra verification for this merchant</span>
                </label>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm flex-1">Cancel</button>
                <button onClick={add} className="btn-primary text-sm flex-1">Add Merchant</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
