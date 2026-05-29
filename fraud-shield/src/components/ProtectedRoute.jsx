import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Admin-only route but user is not admin → send to user dashboard
  if (adminOnly && user.role !== 'admin') return <Navigate to="/user/dashboard" replace />;

  // User route but user is admin → send to admin dashboard
  if (!adminOnly && user.role === 'admin' && window.location.pathname.startsWith('/user')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
