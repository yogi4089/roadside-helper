-- Create customers table
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

-- Create mechanics table
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
