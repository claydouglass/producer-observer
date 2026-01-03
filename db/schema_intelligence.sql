-- Producer Observer PostgreSQL Schema - Intelligence & Learning
-- ============================================================================
-- FORECASTS & PREDICTIONS (Performance Loop)
-- ============================================================================

-- Stored forecasts for comparison to actuals
CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),

    -- Forecast period
    forecast_month DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Predictions
    predicted_revenue DECIMAL(10,2),
    predicted_min DECIMAL(10,2),
    predicted_max DECIMAL(10,2),
    scenario VARCHAR(20),  -- conservative, base, upside

    -- After actuals come in
    actual_revenue DECIMAL(10,2),
    accuracy_pct DECIMAL(5,2),
    evaluated_at TIMESTAMPTZ
);

CREATE INDEX idx_forecasts_brand ON forecasts(brand_id);
CREATE INDEX idx_forecasts_month ON forecasts(forecast_month);

-- ============================================================================
-- USER FEEDBACK (Human-in-the-Loop)
-- ============================================================================

-- User accounts (for Pro tier)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    tier VARCHAR(20) DEFAULT 'observer',  -- observer, pro
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-brand associations (which brands can user see)
CREATE TABLE user_brands (
    user_id UUID REFERENCES users(id),
    brand_id UUID REFERENCES brands(id),
    role VARCHAR(20) DEFAULT 'viewer',  -- viewer, admin
    PRIMARY KEY (user_id, brand_id)
);

-- Simulation decisions (what users toggle in Simulate tab)
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    brand_id UUID REFERENCES brands(id),
    retailer_id UUID REFERENCES retailers(id),

    decision_key VARCHAR(50),  -- indicaSupply, launch510LR, etc.
    decision_value BOOLEAN,
    scenario VARCHAR(20),

    -- Context at time of decision
    forecast_at_decision DECIMAL(10,2),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_decisions_user ON decisions(user_id);
CREATE INDEX idx_decisions_brand ON decisions(brand_id);

-- General feedback/interactions
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    event_type VARCHAR(50),  -- filter_change, tab_switch, export, etc.
    event_data JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
