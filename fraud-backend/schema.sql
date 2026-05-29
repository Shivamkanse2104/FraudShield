-- ============================================================
-- Fraud Shield - PostgreSQL Database Schema
-- Run this manually OR let SQLAlchemy auto-create via main.py
-- ============================================================

CREATE DATABASE fraudshield;
\c fraudshield;

-- Enums
CREATE TYPE user_role    AS ENUM ('admin', 'user');
CREATE TYPE user_status  AS ENUM ('active', 'flagged', 'suspended');
CREATE TYPE user_tier    AS ENUM ('gold', 'silver', 'bronze');
CREATE TYPE tx_status    AS ENUM ('approved', 'flagged', 'blocked', 'pending');
CREATE TYPE alert_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status   AS ENUM ('new', 'investigating', 'resolved');

-- Users
CREATE TABLE users (
    id               VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    hashed_password  TEXT         NOT NULL,
    phone            VARCHAR(20),
    role             user_role    NOT NULL DEFAULT 'user',
    status           user_status  NOT NULL DEFAULT 'active',
    tier             user_tier    NOT NULL DEFAULT 'bronze',
    risk_score       FLOAT        NOT NULL DEFAULT 0.0,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Transactions
CREATE TABLE transactions (
    id               VARCHAR(36)  PRIMARY KEY,
    user_id          VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount           FLOAT        NOT NULL,
    merchant         VARCHAR(200) NOT NULL,
    category         VARCHAR(100) NOT NULL DEFAULT 'Retail',
    location         VARCHAR(200) NOT NULL,
    card_last4       VARCHAR(4),
    payment_method   VARCHAR(50)  DEFAULT 'card',
    transaction_type VARCHAR(50)  DEFAULT 'Online',
    status           tx_status    NOT NULL DEFAULT 'pending',
    risk_score       FLOAT        NOT NULL DEFAULT 0.0,
    reason           TEXT,
    ip_address       VARCHAR(45),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tx_user_id   ON transactions(user_id);
CREATE INDEX idx_tx_status    ON transactions(status);
CREATE INDEX idx_tx_created   ON transactions(created_at DESC);

-- Devices
CREATE TABLE devices (
    id           VARCHAR(36)  PRIMARY KEY,
    user_id      VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(200) NOT NULL,
    device_type  VARCHAR(50)  DEFAULT 'Mobile',
    os           VARCHAR(100),
    location     VARCHAR(200),
    ip_address   VARCHAR(45),
    fingerprint  VARCHAR(255) UNIQUE,
    trusted      BOOLEAN      NOT NULL DEFAULT TRUE,
    last_used    TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_devices_user_id ON devices(user_id);

-- Alerts
CREATE TABLE alerts (
    id             VARCHAR(36)    PRIMARY KEY,
    user_id        VARCHAR(36)    REFERENCES users(id) ON DELETE SET NULL,
    transaction_id VARCHAR(36)    REFERENCES transactions(id) ON DELETE SET NULL,
    alert_type     VARCHAR(50)    NOT NULL DEFAULT 'transaction',
    priority       alert_priority NOT NULL DEFAULT 'medium',
    title          VARCHAR(300)   NOT NULL,
    description    TEXT,
    risk_score     FLOAT          NOT NULL DEFAULT 0.0,
    amount         FLOAT,
    status         alert_status   NOT NULL DEFAULT 'new',
    resolution     VARCHAR(100),
    notes          TEXT,
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW(),
    resolved_at    TIMESTAMP
);
CREATE INDEX idx_alerts_status   ON alerts(status);
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_created  ON alerts(created_at DESC);

-- Rules
CREATE TABLE rules (
    id                 VARCHAR(36)  PRIMARY KEY,
    name               VARCHAR(200) NOT NULL,
    description        TEXT,
    category           VARCHAR(50)  DEFAULT 'transaction',
    action             VARCHAR(50)  DEFAULT 'flag',
    priority           VARCHAR(50)  DEFAULT 'medium',
    condition_field    VARCHAR(100),
    condition_operator VARCHAR(20),
    condition_value    VARCHAR(200),
    condition_display  VARCHAR(300),
    risk_weight        FLOAT        DEFAULT 50.0,
    active             BOOLEAN      NOT NULL DEFAULT TRUE,
    trigger_count      INTEGER      NOT NULL DEFAULT 0,
    created_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_triggered     TIMESTAMP
);

-- Reports
CREATE TABLE reports (
    id           VARCHAR(36)  PRIMARY KEY,
    name         VARCHAR(300) NOT NULL,
    report_type  VARCHAR(100) DEFAULT 'Fraud Analysis',
    status       VARCHAR(50)  DEFAULT 'processing',
    file_size    VARCHAR(20),
    file_path    VARCHAR(500),
    filters      TEXT,
    generated_by VARCHAR(36)  REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);
