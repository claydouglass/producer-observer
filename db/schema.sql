-- Producer Observer PostgreSQL Schema
-- Supports: multi-retailer, brands, suppliers, sales, forecasts, feedback

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Retailers (stores that sell products)
CREATE TABLE retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    license VARCHAR(50),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands (producer's brand identity)
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers (license holders - can be producer or wholesaler)
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    is_wholesaler BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand-Supplier relationships (which suppliers distribute which brands)
CREATE TABLE brand_suppliers (
    brand_id UUID REFERENCES brands(id),
    supplier_id UUID REFERENCES suppliers(id),
    is_producer BOOLEAN DEFAULT FALSE,  -- true if this supplier owns the brand
    PRIMARY KEY (brand_id, supplier_id)
);

-- ============================================================================
-- PRODUCTS & CATEGORIES
-- ============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE  -- Flower, Cartridges, Edibles, etc.
);

CREATE TABLE strain_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE  -- Indica, Sativa, Hybrid, etc.
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
