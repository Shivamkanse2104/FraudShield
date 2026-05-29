# 🛡️ Fraud Shield — Python FastAPI Backend

## Tech Stack
- **Framework**: FastAPI 0.115
- **Database**: PostgreSQL (via SQLAlchemy 2.0)
- **Migrations**: Alembic
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **Validation**: Pydantic v2

---

## Project Structure
```
fraud-backend/
├── main.py                    ← FastAPI app + router registration
├── seed.py                    ← Database seeder with demo data
├── schema.sql                 ← Raw PostgreSQL schema (optional)
├── requirements.txt
├── alembic.ini
├── alembic/
│   └── env.py
└── app/
    ├── core/
    │   ├── config.py          ← Settings from .env
    │   ├── database.py        ← SQLAlchemy engine + session
    │   └── security.py        ← JWT, password hashing, auth deps
    ├── models/
    │   ├── user.py            ← Users table
    │   ├── transaction.py     ← Transactions table
    │   ├── device.py          ← Devices table
    │   ├── alert.py           ← Alerts table
    │   ├── rule.py            ← Fraud rules table
    │   └── report.py          ← Reports table
    ├── schemas/
    │   └── schemas.py         ← All Pydantic request/response models
    ├── routers/
    │   ├── auth.py            ← POST /api/auth/login, /register, /me
    │   ├── users.py           ← GET/PUT /api/users
    │   ├── transactions.py    ← GET/POST /api/transactions + /check
    │   ├── devices.py         ← GET/POST/DELETE /api/devices
    │   ├── alerts.py          ← GET/PUT /api/alerts
    │   ├── rules.py           ← GET/POST/PUT/PATCH /api/rules
    │   ├── reports.py         ← GET/POST /api/reports
    │   └── analytics.py       ← GET /api/analytics
    └── services/
        └── fraud_engine.py    ← Risk score calculation engine
```

---

## Setup Instructions

### 1. Create PostgreSQL database
```sql
CREATE DATABASE fraudshield;
```

### 2. Clone & install dependencies
```bash
cd fraud-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL and SECRET_KEY
```

### 4. Create tables
```bash
# Option A — Auto create via SQLAlchemy (recommended for dev)
python main.py   # tables created on startup

# Option B — Run raw SQL
psql -U postgres -d fraudshield -f schema.sql

# Option C — Alembic migrations (recommended for production)
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

### 5. Seed demo data
```bash
python seed.py
```

### 6. Run the server
```bash
uvicorn main:app --reload --port 8000
```

### 7. View API docs
Open http://localhost:8000/docs

---

## API Endpoints

### Auth
| Method | Endpoint              | Description              | Auth     |
|--------|-----------------------|--------------------------|----------|
| POST   | /api/auth/login       | Login, returns JWT token | Public   |
| POST   | /api/auth/register    | Register new user        | Public   |
| GET    | /api/auth/me          | Get current user info    | Any user |

### Users (Admin only)
| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| GET    | /api/users                  | List all users         |
| GET    | /api/users/stats            | User count stats       |
| GET    | /api/users/{id}             | Get user profile       |
| GET    | /api/users/{id}/details     | Full details + history |
| PUT    | /api/users/{id}             | Update user            |
| DELETE | /api/users/{id}             | Delete user            |

### Transactions
| Method | Endpoint                       | Description                  | Auth     |
|--------|--------------------------------|------------------------------|----------|
| GET    | /api/transactions              | List transactions            | Any user |
| GET    | /api/transactions/stats        | Transaction stats            | Admin    |
| POST   | /api/transactions/check        | Manual fraud check + save    | Any user |
| GET    | /api/transactions/{id}         | Get single transaction       | Any user |
| PUT    | /api/transactions/{id}/status  | Approve/flag/block           | Admin    |

### Devices
| Method | Endpoint                    | Description            | Auth     |
|--------|-----------------------------|------------------------|----------|
| GET    | /api/devices                | List devices           | Any user |
| POST   | /api/devices                | Add device             | Any user |
| PUT    | /api/devices/{id}/trust     | Update trust status    | Any user |
| DELETE | /api/devices/{id}           | Remove device          | Any user |

### Alerts (Admin only)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /api/alerts        | List alerts        |
| GET    | /api/alerts/stats  | Alert stats        |
| GET    | /api/alerts/{id}   | Get single alert   |
| PUT    | /api/alerts/{id}   | Update alert       |
| DELETE | /api/alerts/{id}   | Delete alert       |

### Rules (Admin only)
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| GET    | /api/rules                 | List rules        |
| GET    | /api/rules/stats           | Rule stats        |
| POST   | /api/rules                 | Create rule       |
| PUT    | /api/rules/{id}            | Update rule       |
| PATCH  | /api/rules/{id}/toggle     | Enable/disable    |
| DELETE | /api/rules/{id}            | Delete rule       |

### Reports (Admin only)
| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| GET    | /api/reports          | List reports     |
| GET    | /api/reports/stats    | Report stats     |
| POST   | /api/reports          | Generate report  |
| DELETE | /api/reports/{id}     | Delete report    |

### Analytics (Admin only)
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/analytics          | Full analytics data      |
| GET    | /api/analytics/dashboard| Dashboard KPI cards      |

---

## Connecting to the React Frontend

In your frontend, update `src/context/AuthContext.jsx`:

```js
const API = "http://localhost:8000";

const login = async (email, password) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    return { success: false, error: err.detail };
  }
  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  setUser(data.user);
  return { success: true, user: data.user };
};

const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
};
```

For authenticated requests (e.g. in admin pages):
```js
const token = localStorage.getItem("token");
const res = await fetch(`${API}/api/transactions`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
```

---

## Demo Credentials (after seeding)
- **Admin**: admin@fraud.com / admin123
- **User**:  user@fraud.com  / user123

---

## Fraud Detection Engine

The risk engine is in `app/services/fraud_engine.py`.
It currently uses rule-based scoring. To plug in a real ML model:

```python
# fraud_engine.py — replace calculate_risk_score() with:
import joblib
model = joblib.load("model.pkl")

def calculate_risk_score(amount, merchant, location, ...):
    features = vectorize(amount, merchant, location, ...)
    risk = model.predict_proba(features)[0][1] * 100
    ...
```
