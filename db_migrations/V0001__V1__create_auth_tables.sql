
CREATE TABLE IF NOT EXISTS t_p40859566_messaging_app_creati.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT '',
  username VARCHAR(50),
  avatar_color VARCHAR(20) DEFAULT '#8B5CF6',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p40859566_messaging_app_creati.otp_codes (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p40859566_messaging_app_creati.sessions (
  id SERIAL PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES t_p40859566_messaging_app_creati.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON t_p40859566_messaging_app_creati.otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p40859566_messaging_app_creati.sessions(token);
