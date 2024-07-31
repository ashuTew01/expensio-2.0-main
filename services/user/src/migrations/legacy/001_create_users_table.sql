CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash TEXT,  
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    profile_picture_url TEXT,
    bio varchar(300),
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    password_reset_token TEXT,
    password_reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(15) UNIQUE, 
    otp VARCHAR(6),  -- OTP
    otp_verified BOOLEAN DEFAULT FALSE,
    otp_requested_at TIMESTAMP,  -- when OTP was last requested
    request_count INTEGER DEFAULT 0,  -- OTP request counts
    blocked_until TIMESTAMP,  -- Block OTP requests after limits reached
    created_by INT REFERENCES users(id),
    updated_by INT REFERENCES users(id)
);

-- Indexes for quick lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token);

-- Unique Constraints
ALTER TABLE users ADD CONSTRAINT email_unique UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT username_unique UNIQUE (username);

-- Check Constraints
ALTER TABLE users ADD CONSTRAINT is_active_check CHECK (is_active IN (true, false));
ALTER TABLE users ADD CONSTRAINT is_verified_check CHECK (is_verified IN (true, false));

-- Default Values
ALTER TABLE users ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE users ALTER COLUMN is_verified SET DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Foreign Keys
ALTER TABLE users ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES users(id);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
