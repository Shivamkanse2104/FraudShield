# 🛡️ Fraud Shield - Complete Frontend Codebase

## Quick Start
```bash
npm install
npm run dev
```

## Demo Credentials
- Admin: admin@fraud.com / admin123
- User:  user@fraud.com / user123

## Tech Stack
React 18 + Vite + Tailwind CSS v3 + React Router v6 + Recharts + Lucide React

## 18 Pages Built
Public: Login, Register
Admin: Dashboard, Users, User Details, Transactions, Alerts, Alert Investigation, Analytics, Rules Engine, Reports, Settings
User: Dashboard, Transactions, Devices, Manual Check, FAQ

## Backend Integration Points

### 1. Replace auth in src/context/AuthContext.jsx
```js
const login = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { user, token } = await res.json();
  localStorage.setItem('token', token);
  setUser(user);
  return { success: true, user };
};
```

### 2. Replace user data in src/context/UserDataContext.jsx
```js
const getUserData = async (userId) => {
  const res = await fetch(`/api/users/${userId}/data`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
};
```

### 3. Replace mock arrays in admin pages with fetch() calls
Each admin page (AdminDashboard.jsx, AdminUsers.jsx etc.) has
hardcoded arrays at the top. Swap them with useEffect + fetch:
```js
const [data, setData] = useState([]);
useEffect(() => {
  fetch('/api/admin/transactions', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(r => r.json()).then(setData);
}, []);
```

## API Endpoints to Build
POST   /api/auth/login              - Authenticate user, return JWT
POST   /api/auth/register           - Register new user
GET    /api/users                   - List all users (admin only)
GET    /api/users/:id               - Get user details + transactions + devices
PUT    /api/users/:id/status        - Update user status (suspend/activate)
GET    /api/transactions            - List all transactions (admin) or user's own
POST   /api/transactions/check      - Manual fraud risk check
PUT    /api/transactions/:id/status - Approve / flag / block
GET    /api/alerts                  - List fraud alerts
PUT    /api/alerts/:id              - Update alert status
GET    /api/analytics               - Analytics metrics + chart data
GET    /api/rules                   - List fraud detection rules
POST   /api/rules                   - Create new rule
PUT    /api/rules/:id               - Update / toggle rule
GET    /api/reports                 - List reports
POST   /api/reports/generate        - Generate a new report
GET    /api/devices                 - List devices (admin or user scoped)
POST   /api/devices                 - Add new device
DELETE /api/devices/:id             - Remove device

## Folder Structure
src/
  context/       <- AuthContext, ThemeContext, UserDataContext
  components/    <- Navigation, NotificationBell, ProtectedRoute
  pages/
    admin/       <- 10 admin pages
    user/        <- 5 user pages
    Login.jsx
    Register.jsx
  App.jsx        <- All routes
