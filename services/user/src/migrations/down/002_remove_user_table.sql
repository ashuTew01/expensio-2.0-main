-- Drop triggers
DROP TRIGGER IF EXISTS update_user_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Remove unique constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS email_unique;
ALTER TABLE users DROP CONSTRAINT IF EXISTS username_unique;

-- Remove check constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS is_active_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS is_email_verified_check;

-- Drop indexes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_phone;
DROP INDEX IF EXISTS idx_users_email_verification_token;

-- Drop the table
DROP TABLE IF EXISTS users;
