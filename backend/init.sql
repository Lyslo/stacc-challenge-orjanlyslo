-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create accounts table with user_id reference
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(10) PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(10) PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    account_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    xp_reward INTEGER NOT NULL,
    icon_type VARCHAR(20) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create savings_goal_milestones table
CREATE TABLE IF NOT EXISTS savings_goal_milestones (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER NOT NULL REFERENCES savings_goals(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    xp_reward INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert test user (Alice) with a fixed UUID
INSERT INTO users (id, username, email, date_of_birth)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Alice', 'alice@example.com', '1990-01-01')
ON CONFLICT (username) DO NOTHING;

-- Insert sample accounts data
INSERT INTO accounts (id, account_number, account_type, balance, currency, user_id)
VALUES 
    ('acc123', '********1234', 'Checking', 15000.25, 'NOK', '123e4567-e89b-12d3-a456-426614174000'),
    ('acc456', '********5678', 'Savings', 25000.75, 'NOK', '123e4567-e89b-12d3-a456-426614174000'),
    ('acc789', '********9101', 'Pension', 25000.75, 'NOK', '123e4567-e89b-12d3-a456-426614174000')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions data
INSERT INTO transactions (id, date, description, amount, currency, account_id) VALUES
    ('txn001', '2023-08-15', 'Grocery Store', -75.50, 'NOK', 'acc123'),
    ('txn002', '2023-08-14', 'Paycheck Deposit', 30000.00, 'NOK', 'acc123'),
    ('txn003', '2023-08-15', 'Online Shopping', -320.25, 'NOK', 'acc123'),
    ('txn004', '2023-08-14', 'Interest Earnings', 50.25, 'NOK', 'acc456'),
    ('txn005', '2023-08-15', 'Rent Payment', -1000.00, 'NOK', 'acc123'),
    ('txn006', '2023-08-14', 'Savings Deposit', 1500.00, 'NOK', 'acc456'),
    ('txn007', '2023-08-15', 'Lunch Out', -45.75, 'NOK', 'acc123'),
    ('txn008', '2023-08-14', 'Savings Deposit', 1000.00, 'NOK', 'acc456'),
    ('txn009', '2023-07-15', 'Pension Deposit', 4000.00, 'NOK', 'acc789'),
    ('txn0010', '2023-08-15', 'Pension Deposit', 4000.00, 'NOK', 'acc789'),
    ('txn0011', '2023-09-15', 'Pension Deposit', 4000.00, 'NOK', 'acc789'),
    ('txn0012', '2023-08-16', 'Coffee Shop', -34.00, 'NOK', 'acc123'),
    ('txn0013', '2023-08-16', 'Public Transport', -28.50, 'NOK', 'acc123'),
    ('txn0014', '2023-08-16', 'Pharmacy', -112.20, 'NOK', 'acc123'),
    ('txn0015', '2023-08-17', 'Electricity Bill', -850.00, 'NOK', 'acc123'),
    ('txn0016', '2023-08-17', 'Streaming Subscription', -129.00, 'NOK', 'acc123'),
    ('txn0017', '2023-08-17', 'Fast Food', -89.50, 'NOK', 'acc123'),
    ('txn0018', '2023-08-18', 'Taxi Ride', -198.00, 'NOK', 'acc123'),
    ('txn0019', '2023-08-18', 'Laundry Service', -230.00, 'NOK', 'acc123'),
    ('txn0020', '2023-08-18', 'Bookstore', -145.75, 'NOK', 'acc123'),
    ('txn0021', '2023-08-22', 'Savings Deposit', 3000.00, 'NOK', 'acc456');

-- Add more savings transactions for Alice (2022-2023)
INSERT INTO transactions (id, date, description, amount, currency, account_id) VALUES
    -- Regular monthly savings deposits (2022)
    ('txn0022', '2022-01-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0023', '2022-02-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0024', '2022-03-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0025', '2022-04-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0026', '2022-05-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0027', '2022-06-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0028', '2022-07-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0029', '2022-08-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0030', '2022-09-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0031', '2022-10-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0032', '2022-11-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0033', '2022-12-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    
    -- Regular monthly savings deposits (2023)
    ('txn0034', '2023-01-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0035', '2023-02-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0036', '2023-03-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0037', '2023-04-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0038', '2023-05-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0039', '2023-06-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    ('txn0040', '2023-07-15', 'Monthly Savings', 5000.00, 'NOK', 'acc456'),
    
    -- Extra savings deposits
    ('txn0041', '2022-04-20', 'Tax Return', 25000.00, 'NOK', 'acc456'),
    ('txn0042', '2022-08-01', 'Summer Bonus', 15000.00, 'NOK', 'acc456'),
    ('txn0043', '2022-12-20', 'Christmas Bonus', 20000.00, 'NOK', 'acc456'),
    ('txn0044', '2023-04-20', 'Tax Return', 28000.00, 'NOK', 'acc456'),
    ('txn0045', '2023-07-01', 'Performance Bonus', 18000.00, 'NOK', 'acc456'),
    
    -- Interest payments
    ('txn0046', '2022-06-30', 'Interest Payment', 1200.00, 'NOK', 'acc456'),
    ('txn0047', '2022-12-31', 'Interest Payment', 1500.00, 'NOK', 'acc456'),
    ('txn0048', '2023-06-30', 'Interest Payment', 1800.00, 'NOK', 'acc456');

-- Update the savings account balance to reflect all transactions
UPDATE accounts 
SET balance = (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE account_id = 'acc456'
)
WHERE id = 'acc456';

-- Insert sample savings goals data
INSERT INTO savings_goals (user_id, title, description, target_amount, current_amount, xp_reward, icon_type, completed)
VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Dream House', 'Save for your dream house', 2000000.00, 0.00, 1000, 'house', false),
    ('123e4567-e89b-12d3-a456-426614174000', 'New Car', 'Save for a new car', 300000.00, 0.00, 500, 'car', false),
    ('123e4567-e89b-12d3-a456-426614174000', 'Early Retirement', 'Build your retirement fund', 5000000.00, 0.00, 2000, 'retirement', false),
    ('123e4567-e89b-12d3-a456-426614174000', 'Education Fund', 'Save for education or courses', 100000.00, 0.00, 300, 'education', false)
ON CONFLICT DO NOTHING;

-- Insert sample milestones for Dream House goal
INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    200000.00,
    100,
    false
FROM savings_goals
WHERE title = 'Dream House'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    500000.00,
    250,
    false
FROM savings_goals
WHERE title = 'Dream House'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    1000000.00,
    400,
    false
FROM savings_goals
WHERE title = 'Dream House'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    2000000.00,
    1000,
    false
FROM savings_goals
WHERE title = 'Dream House'
ON CONFLICT DO NOTHING;

-- Insert sample milestones for New Car goal
INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    50000.00,
    100,
    false
FROM savings_goals
WHERE title = 'New Car'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    150000.00,
    200,
    false
FROM savings_goals
WHERE title = 'New Car'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    300000.00,
    500,
    false
FROM savings_goals
WHERE title = 'New Car'
ON CONFLICT DO NOTHING;

-- Insert sample milestones for Early Retirement goal
INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    500000.00,
    200,
    false
FROM savings_goals
WHERE title = 'Early Retirement'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    1500000.00,
    500,
    false
FROM savings_goals
WHERE title = 'Early Retirement'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    3000000.00,
    1000,
    false
FROM savings_goals
WHERE title = 'Early Retirement'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    5000000.00,
    2000,
    false
FROM savings_goals
WHERE title = 'Early Retirement'
ON CONFLICT DO NOTHING;

-- Insert sample milestones for Education Fund goal
INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    25000.00,
    100,
    false
FROM savings_goals
WHERE title = 'Education Fund'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    50000.00,
    150,
    false
FROM savings_goals
WHERE title = 'Education Fund'
ON CONFLICT DO NOTHING;

INSERT INTO savings_goal_milestones (goal_id, amount, xp_reward, completed)
SELECT 
    id,
    100000.00,
    300,
    false
FROM savings_goals
WHERE title = 'Education Fund'
ON CONFLICT DO NOTHING;