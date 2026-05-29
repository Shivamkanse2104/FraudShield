import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.detail || 'Login failed' };
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.detail || 'Registration failed' };
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Helper for authenticated fetch calls
  const authFetch = async (path, options = {}) => {
    const token = localStorage.getItem('token');
    return fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'admin', login, register, logout, authFetch, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
