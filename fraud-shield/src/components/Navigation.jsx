import { useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Users, CreditCard, Smartphone, AlertTriangle,
  BarChart2, Settings, FileText, HelpCircle, Search, LogOut, Moon, Sun,
  Brain, Briefcase, Eye, ClipboardList, Lock, Bell, Activity, Server,
  ShieldAlert, Store, BookOpen, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const adminLinks = [
  { path: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users',        icon: Users,           label: 'Users' },
  { path: '/admin/transactions', icon: CreditCard,      label: 'Transactions' },
  { path: '/admin/live-feed',    icon: Activity,        label: 'Live Feed' },
  { path: '/admin/alerts',       icon: AlertTriangle,   label: 'Alerts' },
  { path: '/admin/cases',        icon: Briefcase,       label: 'Cases' },
  { path: '/admin/analytics',    icon: BarChart2,       label: 'Analytics' },
  { path: '/admin/ml-models',    icon: Brain,           label: 'ML Models' },
  { path: '/admin/watchlist',    icon: Eye,             label: 'Watchlist' },
  { path: '/admin/rules',        icon: Settings,        label: 'Rules Engine' },
  { path: '/admin/reports',      icon: FileText,        label: 'Reports' },
  { path: '/admin/audit-log',    icon: ClipboardList,   label: 'Audit Log' },
  { path: '/admin/system-health',icon: Server,          label: 'System Health' },
  { path: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

const userLinks = [
  { path: '/user/dashboard',         icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/user/transactions',      icon: CreditCard,      label: 'My Transactions' },
  { path: '/user/disputes',          icon: ShieldAlert,     label: 'Disputes' },
  { path: '/user/devices',           icon: Smartphone,      label: 'My Devices' },
  { path: '/user/card-controls',     icon: Lock,            label: 'Card Controls' },
  { path: '/user/security',          icon: Shield,          label: 'Security' },
  { path: '/user/alert-preferences', icon: Bell,            label: 'Alert Prefs' },
  { path: '/user/trusted-merchants', icon: Store,           label: 'Trusted Merchants' },
  { path: '/user/fraud-quiz',        icon: BookOpen,        label: 'Fraud Quiz' },
  { path: '/user/manual-check',      icon: Search,          label: 'Check Transaction' },
  { path: '/user/faq',               icon: HelpCircle,      label: 'FAQ' },
];

export default function Navigation() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const links = isAdmin ? adminLinks : userLinks;
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-52 shrink-0 h-screen flex flex-col bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3.5 border-b border-gray-100 dark:border-gray-700">
        <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
          <Shield size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Fraud Shield</div>
          <div className="text-xs text-gray-400 truncate">{isAdmin ? 'Admin Panel' : 'User Panel'}</div>
        </div>
        {isAdmin && <NotificationBell />}
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {links.map(({ path, icon: Icon, label }) => (
          <div key={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}>
            <Icon size={15} className="shrink-0" />
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 border-t border-gray-100 dark:border-gray-700 space-y-0.5">
        <div className="px-3 py-2 mb-1">
          <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{user?.name}</div>
          <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {user?.role || 'User'}
          </span>
        </div>
        <button onClick={toggleTheme} className="sidebar-link w-full">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span className="text-xs">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={14} />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </aside>
  );
}
