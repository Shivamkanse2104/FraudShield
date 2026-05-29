import { useState } from 'react';
import { Search, Download, CheckCircle, AlertTriangle, XCircle, CreditCard } from 'lucide-react';
import Navigation from '../../components/Navigation';

const TRANSACTIONS = [
  { id: 'TXN-8821', date: '2026-04-17 10:45', user: 'mike@example.com', amount: 45000, merchant: 'Amazon', location: 'New York, US', status: 'blocked', risk: 85, reason: 'Unusual location detected' },
  { id: 'TXN-8820', date: '2026-04-17 10:42', user: 'sarah@example.com', amount: 450, merchant: 'Starbucks', location: 'Mumbai, IN', status: 'approved', risk: 12, reason: '' },
  { id: 'TXN-8819', date: '2026-04-17 10:38', user: 'david@example.com', amount: 21000, merchant: 'Best Buy', location: 'Delhi, IN', status: 'flagged', risk: 72, reason: 'High velocity pattern' },
  { id: 'TXN-8818', date: '2026-04-17 10:35', user: 'john@example.com', amount: 8999, merchant: 'Target', location: 'Mumbai, IN', status: 'approved', risk: 8, reason: '' },
  { id: 'TXN-8817', date: '2026-04-17 10:30', user: 'robert@example.com', amount: 75000, merchant: 'Unknown', location: 'Lagos, NG', status: 'blocked', risk: 96, reason: 'Suspicious merchant + location' },
  { id: 'TXN-8816', date: '2026-04-17 10:22', user: 'emily@example.com', amount: 1200, merchant: 'Flipkart', location: 'Bangalore, IN', status: 'approved', risk: 5, reason: '' },
  { id: 'TXN-8815', date: '2026-04-17 10:15', user: 'lisa@example.com', amount: 18500, merchant: 'Zomato', location: 'Chennai, IN', status: 'flagged', risk: 61, reason: 'Unusual amount' },
];

function StatusBadge({ status }) {
  if (status === 'approved') return <span className="badge-success flex items-center gap-1 w-fit"><CheckCircle size={10} />Approved</span>;
  if (status === 'flagged') return <span className="badge-warning flex items-center gap-1 w-fit"><AlertTriangle size={10} />Flagged</span>;
  return <span className="badge-danger flex items-center gap-1 w-fit"><XCircle size={10} />Blocked</span>;
}

export default function AdminTransactions() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = TRANSACTIONS.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()) || t.merchant.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const totals = { total: TRANSACTIONS.length, amount: TRANSACTIONS.reduce((s, t) => s + t.amount, 0), flagged: TRANSACTIONS.filter(t => t.status === 'flagged').length, blocked: TRANSACTIONS.filter(t => t.status === 'blocked').length };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor all system transactions in real-time</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Transactions', value: totals.total, color: 'text-blue-600' },
            { label: 'Total Amount', value: `₹${(totals.amount / 1000).toFixed(0)}k`, color: 'text-gray-900 dark:text-white' },
            { label: 'Flagged', value: totals.flagged, color: 'text-amber-600' },
            { label: 'Blocked', value: totals.blocked, color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search by merchant, transaction ID, or card number..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-secondary flex items-center gap-2 text-sm py-2">
              <Download size={14} /> Export
            </button>
          </div>

          <div className="flex gap-1 mb-4">
            {['All', 'Blocked', 'Flagged', 'Pending', 'Approved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{f}</button>
            ))}
          </div>

          <div className="space-y-0 divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 px-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <CreditCard size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tx.merchant}</span>
                      <span className="text-xs text-gray-400 font-mono">•••• {Math.floor(Math.random() * 9000) + 1000}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{tx.date}</span>
                      {tx.reason && <span className="text-amber-500">{tx.reason}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹{tx.amount.toLocaleString()}</span>
                  <StatusBadge status={tx.status} />
                  <span className={`text-xs font-bold w-14 text-right ${tx.risk >= 80 ? 'text-red-500' : tx.risk >= 60 ? 'text-amber-500' : 'text-green-500'}`}>Risk: {tx.risk}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
