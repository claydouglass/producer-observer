-- Producer Observer PostgreSQL Schema - Sales & Transactions
-- ============================================================================
-- SALES DATA
-- ============================================================================

-- Individual sale transactions
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id VARCHAR(100),
    retailer_id UUID REFERENCES retailers(id),
    product_id UUID REFERENCES products(id),
    brand_id UUID REFERENCES brands(id),
    supplier_id UUID REFERENCES suppliers(id),  -- who retailer bought from
    customer_id VARCHAR(100),  -- anonymized

    -- Financials
    quantity DECIMAL(10,2),
    revenue DECIMAL(10,2),  -- post-discount, post-tax
    cost DECIMAL(10,2),
    profit DECIMAL(10,2),

    -- Timing
    sold_at TIMESTAMPTZ NOT NULL,

    -- Metadata
    customer_type VARCHAR(50),  -- Recreational, Medical
    strain_species VARCHAR(50),
    weight_sold DECIMAL(10,2),
    unit_of_measure VARCHAR(20),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_sales_retailer ON sales(retailer_id);
CREATE INDEX idx_sales_brand ON sales(brand_id);
CREATE INDEX idx_sales_supplier ON sales(supplier_id);
CREATE INDEX idx_sales_sold_at ON sales(sold_at);
CREATE INDEX idx_sales_customer ON sales(customer_id);

-- ============================================================================
-- AGGREGATED VIEWS (for fast dashboard queries)
-- ============================================================================

-- Monthly aggregates by brand at each retailer
CREATE MATERIALIZED VIEW brand_monthly_stats AS
SELECT
    brand_id,
    retailer_id,
    DATE_TRUNC('month', sold_at) AS month,
    SUM(revenue) AS revenue,
    COUNT(*) AS transactions,
    COUNT(DISTINCT customer_id) AS unique_customers,
    SUM(quantity) AS units_sold
FROM sales
GROUP BY brand_id, retailer_id, DATE_TRUNC('month', sold_at);

-- Monthly aggregates by supplier at each retailer
CREATE MATERIALIZED VIEW supplier_monthly_stats AS
SELECT
    supplier_id,
    retailer_id,
    DATE_TRUNC('month', sold_at) AS month,
    SUM(revenue) AS revenue,
    COUNT(*) AS transactions,
    COUNT(DISTINCT customer_id) AS unique_customers
FROM sales
GROUP BY supplier_id, retailer_id, DATE_TRUNC('month', sold_at);

-- Category breakdown by brand
CREATE MATERIALIZED VIEW brand_category_stats AS
SELECT
    s.brand_id,
    s.retailer_id,
    p.category_id,
    c.name AS category_name,
    SUM(s.revenue) AS revenue,
    COUNT(*) AS transactions
FROM sales s
JOIN products p ON s.product_id = p.id
JOIN categories c ON p.category_id = c.id
GROUP BY s.brand_id, s.retailer_id, p.category_id, c.name;
