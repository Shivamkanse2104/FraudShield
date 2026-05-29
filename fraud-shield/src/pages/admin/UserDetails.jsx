import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Shield, Smartphone, CreditCard, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '../../components/Navigation';

const USER_DATA = {
  'user-001': { name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', joinDate: 'Jan 15, 2025', riskScore: 12, status: 'active', tier: 'Gold', totalTx: 145, flaggedTx: 2, blockedTx: 2, devices: 3 },
  'user-003': { name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 87654 32109', joinDate: 'Nov 10, 2024', riskScore: 78, status: 'flagged', tier: 'Silver', totalTx: 234, flaggedTx: 18, blockedTx: 18, devices: 4 },
  'user-005': { name: 'Robert Brown', email: 'robert@example.com', phone: '+91 76543 21098', joinDate: 'Sep 22, 2024', riskScore: 92, status: 'suspended', tier: 'Bronze', totalTx: 156, flaggedTx: 45, blockedTx: 45, devices: 2 },
};

const defaultUser = { name: 'Jane Smith', email: 'jane@example.com', phone: '+91 99887 76655', joinDate: 'Feb 20, 2025', riskScore: 8, status: 'active', tier: 'Silver', totalTx: 89, flaggedTx: 0, blockedTx: 0, devices: 2 };

const RECENT_TX = [
  { id: 'TXN-001', date: 'Apr 17, 2026 10:45', amount: 2500, merchant: 'Amazon India', status: 'approved', risk: 15 },
  { id: 'TXN-002', date: 'Apr 16, 2026 14:22', amount: 15000, merchant: 'Flipkart', status: 'approved', risk: 22 },
  { id: 'TXN-003', date: 'Apr 15, 2026 09:10', amount: 8500, merchant: 'Swiggy', status: 'flagged', risk: 65 },
];

export default function UserDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const user = USER_DATA[id] || defaultUser;

  const riskColor = user.riskScore >= 80 ? 'text-red-500' : user.riskScore >= 60 ? 'text-amber-500' : user.riskScore >= 30 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5">
          <ArrowLeft size={16} /> Back to Users
        </button>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Profile card */}
          <div className="card p-5 col-span-1">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-3">
                <User size={28} className="text-blue-500" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <span className={`mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${user.status === 'active' ? 'badge-success' : user.status === 'flagged' ? 'badge-warning' : 'badge-danger'}`}>{user.status}</span>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { icon: Mail, label: user.email },
                { icon: Phone, label: user.phone },
                { icon: Clock, label: `Joined ${user.joinDate}` },
                { icon: Shield, label: `${user.tier} Member` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Icon size={14} className="shrink-0" />
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Risk Score</p>
              <p className={`text-2xl font-bold ${riskColor}`}>{user.riskScore}%</p>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
                <div className={`h-1.5 rounded-full ${user.riskScore >= 80 ? 'bg-red-500' : user.riskScore >= 60 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${user.riskScore}%` }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Transactions', value: user.totalTx, color: 'text-blue-600' },
                { label: 'Flagged Transactions', value: user.flaggedTx, color: 'text-amber-600' },
                { label: 'Blocked Transactions', value: user.blockedTx, color: 'text-red-600' },
                { label: 'Active Devices', value: user.devices, color: 'text-green-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card p-4">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Account Actions</p>
              <div className="flex gap-2 flex-wrap">
                <button className="btn-secondary text-xs py-1.5">Suspend Account</button>
                <button className="btn-secondary text-xs py-1.5">Reset Password</button>
                <button className="btn-secondary text-xs py-1.5 flex items-center gap-1"><Mail size={12} /> Send Email</button>
                <button className="btn-primary text-xs py-1.5">View Full History</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-2">ID</th>
                <th className="text-left pb-2">Date</th>
                <th className="text-right pb-2">Amount</th>
                <th className="text-left pb-2">Merchant</th>
                <th className="text-center pb-2">Status</th>
                <th className="text-right pb-2">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {RECENT_TX.map(tx => (
                <tr key={tx.id} className="text-sm">
                  <td className="py-2.5 font-mono text-xs text-gray-400">{tx.id}</td>
                  <td className="py-2.5 text-xs text-gray-500">{tx.date}</td>
                  <td className="py-2.5 text-right font-medium text-gray-900 dark:text-white">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-2.5 text-gray-700 dark:text-gray-300">{tx.merchant}</td>
                  <td className="py-2.5 text-center">
                    {tx.status === 'approved' ? <span className="badge-success">✓ Approved</span> : <span className="badge-warning">⚠ Flagged</span>}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs font-bold ${tx.risk >= 60 ? 'text-amber-500' : 'text-green-500'}`}>{tx.risk}%</span>
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
