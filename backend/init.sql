-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(10) PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    owner VARCHAR(50) NOT NULL
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

-- Insert sample accounts data
INSERT INTO accounts (id, account_number, account_type, balance, currency, owner) VALUES
    ('acc123', '********1234', 'Checking', 15000.25, 'NOK', 'Alice'),
    ('acc456', '********5678', 'Savings', 25000.75, 'NOK', 'Alice'),
    ('acc789', '********9101', 'Pension', 25000.75, 'NOK', 'Alice');

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