-- Drop the trigger and function
DROP TRIGGER IF EXISTS update_user_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Drop the table (this will also drop constraints and indexes)
DROP TABLE IF EXISTS users;
