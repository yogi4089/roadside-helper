-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mechanics table
CREATE TABLE IF NOT EXISTS mechanics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(200),
    service_category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    mechanic_id INTEGER REFERENCES mechanics(id),
    customer_name VARCHAR(100) NOT NULL,
    mechanic_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    location VARCHAR(200) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
); 