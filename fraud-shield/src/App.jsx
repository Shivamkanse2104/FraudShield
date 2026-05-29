import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserDataProvider } from './context/UserDataContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminCases from './pages/admin/AdminCases';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminMLModels from './pages/admin/AdminMLModels';
import AdminWatchlist from './pages/admin/AdminWatchlist';
import AdminRules from './pages/admin/AdminRules';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLog from './pages/admin/AdminAuditLog';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLiveFeed from './pages/admin/AdminLiveFeed';
import AdminSystemHealth from './pages/admin/AdminSystemHealth';
import UserDetails from './pages/admin/UserDetails';
import AlertInvestigation from './pages/admin/AlertInvestigation';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import UserTransactions from './pages/user/UserTransactions';
import UserDisputes from './pages/user/UserDisputes';
import UserDevices from './pages/user/UserDevices';
import UserCardControls from './pages/user/UserCardControls';
import UserSecurity from './pages/user/UserSecurity';
import UserAlertPreferences from './pages/user/UserAlertPreferences';
import UserTrustedMerchants from './pages/user/UserTrustedMerchants';
import UserFraudQuiz from './pages/user/UserFraudQuiz';
import UserManualCheck from './pages/user/UserManualCheck';
import UserFAQ from './pages/user/UserFAQ';

const A = ({ children }) => <ProtectedRoute adminOnly>{children}</ProtectedRoute>;
const U = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Admin */}
              <Route path="/admin/dashboard"           element={<A><AdminDashboard /></A>} />
              <Route path="/admin/users"               element={<A><AdminUsers /></A>} />
              <Route path="/admin/transactions"        element={<A><AdminTransactions /></A>} />
              <Route path="/admin/alerts"              element={<A><AdminAlerts /></A>} />
              <Route path="/admin/cases"               element={<A><AdminCases /></A>} />
              <Route path="/admin/live-feed"           element={<A><AdminLiveFeed /></A>} />
              <Route path="/admin/analytics"           element={<A><AdminAnalytics /></A>} />
              <Route path="/admin/ml-models"           element={<A><AdminMLModels /></A>} />
              <Route path="/admin/watchlist"           element={<A><AdminWatchlist /></A>} />
              <Route path="/admin/rules"               element={<A><AdminRules /></A>} />
              <Route path="/admin/reports"             element={<A><AdminReports /></A>} />
              <Route path="/admin/audit-log"           element={<A><AdminAuditLog /></A>} />
              <Route path="/admin/system-health"       element={<A><AdminSystemHealth /></A>} />
              <Route path="/admin/settings"            element={<A><AdminSettings /></A>} />
              <Route path="/admin/user-details"        element={<A><UserDetails /></A>} />
              <Route path="/admin/alert-investigation" element={<A><AlertInvestigation /></A>} />

              {/* User */}
              <Route path="/user/dashboard"            element={<U><UserDashboard /></U>} />
              <Route path="/user/transactions"         element={<U><UserTransactions /></U>} />
              <Route path="/user/disputes"             element={<U><UserDisputes /></U>} />
              <Route path="/user/devices"              element={<U><UserDevices /></U>} />
              <Route path="/user/card-controls"        element={<U><UserCardControls /></U>} />
              <Route path="/user/security"             element={<U><UserSecurity /></U>} />
              <Route path="/user/alert-preferences"    element={<U><UserAlertPreferences /></U>} />
              <Route path="/user/trusted-merchants"    element={<U><UserTrustedMerchants /></U>} />
              <Route path="/user/fraud-quiz"           element={<U><UserFraudQuiz /></U>} />
              <Route path="/user/manual-check"         element={<U><UserManualCheck /></U>} />
              <Route path="/user/faq"                  element={<U><UserFAQ /></U>} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </UserDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
