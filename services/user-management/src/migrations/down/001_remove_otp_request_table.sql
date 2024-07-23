-- Drop indexes
DROP INDEX IF EXISTS idx_otp_requests_phone;
DROP INDEX IF EXISTS idx_otp_requests_last_request_time;

-- automatically dropped with table, still...
ALTER TABLE otp_requests DROP CONSTRAINT IF EXISTS phone_unique;

-- automatically dropped with table, still...
ALTER TABLE otp_requests DROP CONSTRAINT IF EXISTS request_count_check;


DROP TABLE IF EXISTS otp_requests;
