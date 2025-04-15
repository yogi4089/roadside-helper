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
=======
CREATE TABLE IF NOT EXISTS customer
(
    id integer NOT NULL DEFAULT nextval('customer_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    contact character varying(20) COLLATE pg_catalog."default",
    gender character varying(10) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT customer_pkey PRIMARY KEY (id),
    CONSTRAINT customer_email_key UNIQUE (email)
)
>>>>>>> b5cc8891b787ba362848eb5dff81f601590e4038


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
=======
CREATE TABLE IF NOT EXISTS mechanics
(
    id integer NOT NULL DEFAULT nextval('mechanics_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    location character varying(200) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    service_category character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT mechanics_pkey PRIMARY KEY (id),
    CONSTRAINT mechanics_email_key UNIQUE (email)
)
-- Create services table
CREATE TABLE IF NOT EXISTS services
(
    id integer NOT NULL DEFAULT nextval('services_id_seq'::regclass),
    customer_id integer NOT NULL,
    customer_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    mechanic_id integer NOT NULL,
    mechanic_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    service_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    vehicle_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    contact_number character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT services_pkey PRIMARY KEY (id)
)
>>>>>>> b5cc8891b787ba362848eb5dff81f601590e4038
