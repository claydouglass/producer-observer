-- Producer Observer PostgreSQL Schema - Market Intelligence
-- ============================================================================
-- MARKET GAPS & OPPORTUNITIES
-- ============================================================================

-- Market gaps identified for each brand at each retailer
CREATE TABLE market_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),

    gap_name VARCHAR(100),  -- "Gummies", "510 Thread LR", etc.
    gap_category_id UUID REFERENCES categories(id),

    market_size DECIMAL(10,2),  -- total $ opportunity
    priority VARCHAR(20),  -- critical, high, medium, low

    -- Current state
    brand_presence DECIMAL(10,2) DEFAULT 0,

    identified_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PARTNERSHIP METRICS
-- ============================================================================

CREATE TABLE partnership_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),

    metric_date DATE NOT NULL,

    -- KPIs
    fill_rate DECIMAL(5,2),
    forecast_accuracy DECIMAL(5,2),
    response_time_hours DECIMAL(5,2),
    growth_pct DECIMAL(5,2),

    -- Ranking
    rank_at_retailer INT,
    total_brands_at_retailer INT,
    market_share_pct DECIMAL(5,2),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partnership_brand ON partnership_metrics(brand_id);
CREATE INDEX idx_partnership_date ON partnership_metrics(metric_date);

-- ============================================================================
-- INVENTORY (for Pro tier - connects to producer ERP)
-- ============================================================================

CREATE TABLE inventory_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    product_id UUID REFERENCES products(id),

    snapshot_date DATE NOT NULL,
    quantity_on_hand DECIMAL(10,2),
    quantity_allocated DECIMAL(10,2),
    quantity_available DECIMAL(10,2),

    -- From ERP integration
    erp_source VARCHAR(50),
    erp_id VARCHAR(100),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
