CREATE TABLE otp_requests (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL UNIQUE,
    otp VARCHAR(6) NOT NULL,
    request_count INTEGER DEFAULT 0,
    last_request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp_expiry TIMESTAMP NOT NULL,
    is_blocked_until TIMESTAMP,
    user_exists BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_otp_requests_phone ON otp_requests(phone);
CREATE INDEX idx_otp_requests_last_request_time ON otp_requests(last_request_time);

-- Unique Constraints
ALTER TABLE otp_requests ADD CONSTRAINT phone_unique UNIQUE (phone);

-- Check Constraints
ALTER TABLE otp_requests ADD CONSTRAINT request_count_check CHECK (request_count >= 0);
