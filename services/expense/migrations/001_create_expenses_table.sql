CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    goal_id VARCHAR(255),
    event_id VARCHAR(255),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    psychological_type_id VARCHAR(255),
    date_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(255),
    notes TEXT[],
    mood VARCHAR(50) DEFAULT 'neutral'
);
