-- Check if customer table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customer') THEN
        -- Create customer table
        CREATE TABLE customer (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            contact VARCHAR(20),
            gender VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        RAISE NOTICE 'Customer table created successfully';
    ELSE
        RAISE NOTICE 'Customer table already exists';
    END IF;
END $$;

-- Check if mechanics table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mechanics') THEN
        -- Create mechanics table
        CREATE TABLE mechanics (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            location VARCHAR(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        RAISE NOTICE 'Mechanics table created successfully';
    ELSE
        RAISE NOTICE 'Mechanics table already exists';
    END IF;
END $$;

-- Check if service_history table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_history') THEN
        -- Create service_history table
        CREATE TABLE service_history (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES customer(id),
            mechanic_id INTEGER REFERENCES mechanics(id),
            status VARCHAR(20) DEFAULT 'pending',
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            description TEXT
        );
        RAISE NOTICE 'Service history table created successfully';
    ELSE
        RAISE NOTICE 'Service history table already exists';
    END IF;
END $$; 