import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, UserCheck, AlertTriangle, UserPlus } from 'lucide-react';
import Navigation from '../../components/Navigation';

const USERS = [
  { id: 'user-001', name: 'John Doe', email: 'john@example.com', joinDate: '2025-01-15', transactions: 145, riskScore: 12, status: 'active', blocked: 2 },
  { id: 'user-002', name: 'Jane Smith', email: 'jane@example.com', joinDate: '2025-02-20', transactions: 89, riskScore: 8, status: 'active', blocked: 0 },
  { id: 'user-003', name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-11-10', transactions: 234, riskScore: 78, status: 'flagged', blocked: 18 },
  { id: 'user-004', name: 'Sarah Williams', email: 'sarah@example.com', joinDate: '2025-03-05', transactions: 67, riskScore: 15, status: 'active', blocked: 1 },
  { id: 'user-005', name: 'Robert Brown', email: 'robert@example.com', joinDate: '2024-09-22', transactions: 156, riskScore: 92, status: 'suspended', blocked: 45 },
  { id: 'user-006', name: 'Emily Davis', email: 'emily@example.com', joinDate: '2025-01-30', transactions: 98, riskScore: 6, status: 'active', blocked: 0 },
  { id: 'user-007', name: 'David Miller', email: 'david@example.com', joinDate: '2024-12-15', transactions: 187, riskScore: 65, status: 'flagged', blocked: 12 },
  { id: 'user-008', name: 'Lisa Anderson', email: 'lisa@example.com', joinDate: '2025-04-01', transactions: 123, riskScore: 10, status: 'active', blocked: 1 },
];

function RiskBadge({ score }) {
  const color = score >= 80 ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
    : score >= 60 ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
    : score >= 30 ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400'
    : 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{score}%</span>;
}

function StatusBadge({ status }) {
  if (status === 'active') return <span className="badge-success">✓ active</span>;
  if (status === 'flagged') return <span className="badge-warning">⚠ flagged</span>;
  return <span className="badge-danger">⊘ suspended</span>;
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = { total: USERS.length, active: USERS.filter(u => u.status === 'active').length, flagged: USERS.filter(u => u.status === 'flagged').length, new: 3 };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and monitor all system users</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: counts.total, icon: Users, color: 'bg-blue-500' },
            { label: 'Active Users', value: counts.active, icon: UserCheck, color: 'bg-green-500' },
            { label: 'Flagged Users', value: counts.flagged, icon: AlertTriangle, color: 'bg-amber-500' },
            { label: 'New This Month', value: counts.new, icon: UserPlus, color: 'bg-purple-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search users by name, email, or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1">
              {['all', 'active', 'flagged', 'suspended'].map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{s}</button>
              ))}
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-3">User ID</th>
                <th className="text-left pb-3">Name</th>
                <th className="text-left pb-3">Email</th>
                <th className="text-center pb-3">Status</th>
                <th className="text-right pb-3">Risk Score</th>
                <th className="text-right pb-3">Transactions</th>
                <th className="text-right pb-3">Blocked</th>
                <th className="text-center pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.map(u => (
                <tr key={u.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 font-mono text-xs text-gray-400">{u.id}</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="py-3 text-center"><StatusBadge status={u.status} /></td>
                  <td className="py-3 text-right"><RiskBadge score={u.riskScore} /></td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">{u.transactions}</td>
                  <td className="py-3 text-right font-medium text-red-500">{u.blocked}</td>
                  <td className="py-3 text-center">
                    <button onClick={() => navigate(`/admin/user-details?id=${u.id}`)} className="btn-primary py-1 px-3 text-xs">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
