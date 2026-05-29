import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_NOTIFICATIONS = [
  { id: 'N1', type: 'alert', title: 'New High-Risk Activity', description: 'Risk score 89% detected - Requires immediate review', riskScore: 89, timestamp: new Date(Date.now() - 60000), read: false },
  { id: 'N2', type: 'alert', title: 'New High-Risk Activity', description: 'Risk score 96% detected - Requires immediate review', riskScore: 96, timestamp: new Date(Date.now() - 120000), read: false },
  { id: 'N3', type: 'transaction', title: 'High-Risk Transaction Detected', description: 'Transaction of ₹25,000 from user Mike Johnson flagged', riskScore: 92, amount: 25000, timestamp: new Date(Date.now() - 180000), read: false },
  { id: 'N4', type: 'alert', title: 'Critical Security Alert', description: 'Multiple high-risk transactions from same IP', riskScore: 88, timestamp: new Date(Date.now() - 300000), read: false },
  { id: 'N5', type: 'user', title: 'User Risk Score Elevated', description: "Robert Brown's risk score increased to 92%", riskScore: 92, timestamp: new Date(Date.now() - 600000), read: false },
];

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef(null);
  const navigate = useNavigate();

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const handleClick = (n) => {
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    if (n.type === 'transaction') navigate('/admin/transactions');
    else if (n.type === 'alert') navigate('/admin/alerts');
    else navigate('/admin/users');
    setOpen(false);
  };

  return (
    <div className="relative ml-auto" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Bell size={18} className="text-gray-500 dark:text-gray-400" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-80 card shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">High-Risk Notifications</div>
              <div className="text-xs text-gray-400">{unread} unread notifications</div>
            </div>
            <button onClick={markAllRead} className="text-xs text-blue-500 hover:text-blue-600 font-medium">Mark all read</button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
            {notifications.map(n => (
              <div key={n.id} onClick={() => handleClick(n)} className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? '' : 'ml-2'} bg-red-100 dark:bg-red-900/30`}>
                  <AlertTriangle size={14} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{n.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{timeAgo(n.timestamp)}</span>
                    <span className="badge-danger">Risk: {n.riskScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={() => { navigate('/admin/alerts'); setOpen(false); }} className="w-full text-center text-sm text-blue-500 hover:text-blue-600 font-medium py-1">
              View all alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
