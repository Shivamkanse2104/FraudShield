import { useState } from 'react';
import { Search, Download, CreditCard, CheckCircle, AlertTriangle, XCircle, ShoppingBag } from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { useNavigate } from 'react-router-dom';

function StatusBadge({ status }) {
  if (status === 'approved') return <span className="badge-success flex items-center gap-1"><CheckCircle size={10} />Approved</span>;
  if (status === 'flagged') return <span className="badge-warning flex items-center gap-1"><AlertTriangle size={10} />Flagged</span>;
  return <span className="badge-danger flex items-center gap-1"><XCircle size={10} />Blocked</span>;
}

export default function UserTransactions() {
  const { user } = useAuth();
  const { getUserData } = useUserData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const data = getUserData(user?.id);
  const transactions = data.transactions;

  const filtered = transactions.filter(t => {
    const matchSearch = t.merchant.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const totalSpent = transactions.filter(t => t.status !== 'blocked').reduce((s, t) => s + t.amount, 0);
  const flagged = transactions.filter(t => t.status === 'flagged' || t.status === 'blocked').length;

  if (transactions.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Transactions</h1>
            <p className="text-sm text-gray-500">View and manage your transaction history</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
              <CreditCard size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">No Transactions Yet</h3>
            <p className="text-sm text-gray-400 mb-4">Your transactions will appear here once you make or check one</p>
            <button onClick={() => navigate('/user/manual-check')} className="btn-primary text-sm">Check a Transaction</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Transactions</h1>
          <p className="text-sm text-gray-500">View and manage your transaction history</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Flagged/Blocked</p>
            <p className="text-2xl font-bold text-red-500">{flagged}</p>
            <p className="text-xs text-amber-500 mt-1">Requires attention</p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search by merchant or transaction ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-secondary flex items-center gap-2 text-sm py-2">
              <Download size={14} /> Export
            </button>
          </div>

          <div className="flex gap-1 mb-4">
            {['All', 'Approved', 'Flagged', 'Blocked'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{f}</button>
            ))}
          </div>

          <div className="space-y-0 divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-3 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={15} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.merchant} {tx.cardLast4 && <span className="text-gray-400 font-normal">•••• {tx.cardLast4}</span>}</p>
                    <p className="text-xs text-gray-400">{tx.date} • {tx.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹{tx.amount.toLocaleString()}</span>
                  <StatusBadge status={tx.status} />
                  <span className={`text-xs font-semibold w-12 text-right ${tx.riskScore >= 60 ? 'text-red-500' : tx.riskScore >= 30 ? 'text-amber-500' : 'text-green-500'}`}>Risk: {tx.riskScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
