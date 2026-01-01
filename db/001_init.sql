-- Producer Observer - Initial Schema Migration
-- Run: psql -d producer_observer -f db/001_init.sql

BEGIN;

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

CREATE TABLE retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    license VARCHAR(50),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_wholesaler BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(license, name)
);

CREATE TABLE brand_suppliers (
    brand_id UUID REFERENCES brands(id),
    supplier_id UUID REFERENCES suppliers(id),
    is_producer BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (brand_id, supplier_id)
);

-- ============================================================================
-- PRODUCTS & CATEGORIES
-- ============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE strain_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    brand_id UUID REFERENCES brands(id),
    category_id UUID REFERENCES categories(id),
    strain_type_id UUID REFERENCES strain_types(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SALES
-- ============================================================================

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id VARCHAR(100),
    retailer_id UUID REFERENCES retailers(id),
    product_id UUID REFERENCES products(id),
    brand_id UUID REFERENCES brands(id),
    supplier_id UUID REFERENCES suppliers(id),
    customer_id VARCHAR(100),
    quantity DECIMAL(10,2),
    revenue DECIMAL(10,2),
    cost DECIMAL(10,2),
    profit DECIMAL(10,2),
    sold_at TIMESTAMPTZ NOT NULL,
    customer_type VARCHAR(50),
    strain_species VARCHAR(50),
    weight_sold DECIMAL(10,2),
    unit_of_measure VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sales_retailer ON sales(retailer_id);
CREATE INDEX idx_sales_brand ON sales(brand_id);
CREATE INDEX idx_sales_supplier ON sales(supplier_id);
CREATE INDEX idx_sales_sold_at ON sales(sold_at);

-- ============================================================================
-- USERS & TIERS
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    tier VARCHAR(20) DEFAULT 'observer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_brands (
    user_id UUID REFERENCES users(id),
    brand_id UUID REFERENCES brands(id),
    role VARCHAR(20) DEFAULT 'viewer',
    PRIMARY KEY (user_id, brand_id)
);

-- ============================================================================
-- INTELLIGENCE
-- ============================================================================

CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),
    forecast_month DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    predicted_revenue DECIMAL(10,2),
    predicted_min DECIMAL(10,2),
    predicted_max DECIMAL(10,2),
    scenario VARCHAR(20),
    actual_revenue DECIMAL(10,2),
    accuracy_pct DECIMAL(5,2),
    evaluated_at TIMESTAMPTZ
);

CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),
    decision_key VARCHAR(50),
    decision_value BOOLEAN,
    scenario VARCHAR(20),
    forecast_at_decision DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE market_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),
    gap_name VARCHAR(100),
    gap_category_id UUID REFERENCES categories(id),
    market_size DECIMAL(10,2),
    priority VARCHAR(20),
    brand_presence DECIMAL(10,2) DEFAULT 0,
    identified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partnership_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),
    metric_date DATE NOT NULL,
    fill_rate DECIMAL(5,2),
    forecast_accuracy DECIMAL(5,2),
    response_time_hours DECIMAL(5,2),
    growth_pct DECIMAL(5,2),
    rank_at_retailer INT,
    total_brands_at_retailer INT,
    market_share_pct DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
