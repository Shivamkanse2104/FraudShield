import { useState, useEffect, useRef } from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle, Pause, Play, Filter } from 'lucide-react';
import Navigation from '../../components/Navigation';

const MERCHANTS = ['Amazon India', 'Flipkart', 'Zomato', 'Swiggy', 'Paytm', 'HDFC NetBanking', 'Unknown Merchant', 'Meesho', 'BigBasket', 'MakeMyTrip'];
const LOCATIONS = ['Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'Chennai, IN', 'Hyderabad, IN', 'New York, US', 'Dubai, AE', 'London, UK', 'Lagos, NG'];
const USERS = ['user-001', 'user-002', 'user-003', 'user-004', 'user-005', 'user-006', 'user-007'];

let txCounter = 9000;

function generateTx() {
  const risk = Math.floor(Math.random() * 100);
  const status = risk >= 80 ? 'blocked' : risk >= 60 ? 'flagged' : 'approved';
  txCounter++;
  return {
    id: `TXN-${txCounter}`,
    user: USERS[Math.floor(Math.random() * USERS.length)],
    merchant: MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)],
    amount: Math.floor(Math.random() * 80000) + 200,
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    status,
    risk,
    time: new Date(),
  };
}

function StatusIcon({ status }) {
  if (status === 'approved') return <CheckCircle size={13} className="text-green-500" />;
  if (status === 'flagged') return <AlertTriangle size={13} className="text-amber-500" />;
  return <XCircle size={13} className="text-red-500" />;
}

function StatusBadge({ status }) {
  if (status === 'approved') return <span className="badge-success">Approved</span>;
  if (status === 'flagged') return <span className="badge-warning">Flagged</span>;
  return <span className="badge-danger">Blocked</span>;
}

export default function AdminLiveFeed() {
  const [feed, setFeed] = useState(() => Array.from({ length: 12 }, generateTx));
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, blocked: 0, flagged: 0, approved: 0 });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        const tx = generateTx();
        setFeed(f => [tx, ...f.slice(0, 49)]);
        setStats(s => ({
          total: s.total + 1,
          blocked: s.blocked + (tx.status === 'blocked' ? 1 : 0),
          flagged: s.flagged + (tx.status === 'flagged' ? 1 : 0),
          approved: s.approved + (tx.status === 'approved' ? 1 : 0),
        }));
      }, 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const filtered = feed.filter(tx => filter === 'all' || tx.status === filter);

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 5) return 'just now';
    if (s < 60) return `${s}s ago`;
    return `${Math.floor(s / 60)}m ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Live Transaction Feed</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-2 h-2 rounded-full ${paused ? 'bg-gray-400' : 'bg-green-500 pulse-dot'}`} />
              <p className="text-sm text-gray-500">{paused ? 'Paused' : 'Live — updating every 1.8s'}</p>
            </div>
          </div>
          <button onClick={() => setPaused(p => !p)} className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${paused ? 'btn-primary' : 'btn-secondary'}`}>
            {paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
          </button>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'This Session', value: stats.total + 12, color: 'text-blue-600' },
            { label: 'Approved', value: stats.approved + feed.filter(t => t.status === 'approved').length, color: 'text-green-600' },
            { label: 'Flagged', value: stats.flagged + feed.filter(t => t.status === 'flagged').length, color: 'text-amber-600' },
            { label: 'Blocked', value: stats.blocked + feed.filter(t => t.status === 'blocked').length, color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Transaction Stream</span>
              <span className="text-xs text-gray-400">({filtered.length} shown)</span>
            </div>
            <div className="flex gap-1">
              {['all', 'approved', 'flagged', 'blocked'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto">
            {filtered.map((tx, i) => (
              <div key={tx.id} className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all ${i === 0 && !paused ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <StatusIcon status={tx.status} />
                  <span className="font-mono text-xs text-gray-400 w-20 shrink-0">{tx.id}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate w-32">{tx.merchant}</span>
                  <span className="text-xs text-gray-400 truncate w-28">{tx.location}</span>
                  <span className="text-xs text-gray-400 w-20 shrink-0">{tx.user}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-24 text-right">₹{tx.amount.toLocaleString()}</span>
                  <StatusBadge status={tx.status} />
                  <span className={`text-xs font-bold w-12 text-right ${tx.risk >= 80 ? 'text-red-500' : tx.risk >= 60 ? 'text-amber-500' : 'text-green-500'}`}>{tx.risk}%</span>
                  <span className="text-xs text-gray-300 dark:text-gray-500 w-16 text-right">{timeAgo(tx.time)}</span>
                  <div className="flex gap-1.5 ml-1">
                    <button className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-0.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">✓</button>
                    <button className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">✕</button>
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
