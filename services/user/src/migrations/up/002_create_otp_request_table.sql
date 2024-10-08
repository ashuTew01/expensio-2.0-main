CREATE TABLE otp_requests (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE, -- Make phone optional, but keep it unique
    email VARCHAR(100) UNIQUE, -- Make email optional, but keep it unique
    otp VARCHAR(6) NOT NULL,
    request_count INTEGER DEFAULT 0,
    last_request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp_expiry TIMESTAMP NOT NULL,
    is_blocked_until TIMESTAMP,
    user_exists BOOLEAN DEFAULT FALSE,

    -- CHECK constraint ensuring that at least one of phone or email is present
    CONSTRAINT phone_or_email_present CHECK (
        phone IS NOT NULL OR email IS NOT NULL
    )
);

-- Indexes
CREATE INDEX idx_otp_requests_phone ON otp_requests(phone);
CREATE INDEX idx_otp_requests_email ON otp_requests(email);
CREATE INDEX idx_otp_requests_last_request_time ON otp_requests(last_request_time);

-- Check Constraints
ALTER TABLE otp_requests ADD CONSTRAINT request_count_check CHECK (request_count >= 0);
