-- Create customers table
<<<<<<< HEAD
CREATE TABLE IF NOT EXISTS customer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create mechanics table
<<<<<<< HEAD
CREATE TABLE IF NOT EXISTS mechanics (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL, 
    phone VARCHAR(20), 
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    service_category VARCHAR(255)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY, 
    customer_id INTEGER NOT NULL, 
    customer_name VARCHAR(100) NOT NULL, 
    mechanic_id INTEGER NOT NULL, 
    mechanic_name VARCHAR(100) NOT NULL, 
    service_type VARCHAR(50) NOT NULL, 
    vehicle_type VARCHAR(50) NOT NULL, 
    location VARCHAR(255) NOT NULL, 
    description TEXT, 
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    contact_number VARCHAR(20),
    CONSTRAINT services_customer_id_fk FOREIGN KEY (customer_id) REFERENCES customer(id),
    CONSTRAINT services_mechanic_id_fk FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);

--To reset table--
TRUNCATE TABLE services RESTART IDENTITY;


