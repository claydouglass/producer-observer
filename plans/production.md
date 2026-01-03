# Production Tab

**Purpose:** "What should I produce next?"

Flower takes 4 months to grow. They need demand signals NOW.

---

## Strategy

- Show ALL questions with real demand data we have
- Preview Pro features with **fake/sample data** to show what's possible
- Make them crazy to connect their production data + Metrc
- Clear upgrade path: "Connect your data to make this real"

---

## Questions (in order)

### 1. What should I produce next?
**Answer:** "Concentrates. Growing 23%, you're #3 and climbing."
**Chart:** Category demand trends with growth indicators
**Data:** Real - from sales data

### 2. How much demand is there?
**Answer:** "$14,154 - $19,149 / 8,200 - 11,000 units projected next 6 months."
**Chart:** 6-month demand forecast with uncertainty bands
**Toggle:** Cash / Units view
**Breakdown:** By product type (Flower, Concentrates, etc.) AND strain (Indica, Sativa, Hybrid)
**Data:** Real - extrapolated from sales

**Key insight:** All production decisions are product type + strain. Show demand at that intersection:
- Flower / Indica: $X / Y units
- Flower / Sativa: $X / Y units
- Concentrates / Hybrid: $X / Y units

### 3. Which products have the most demand?
**Answer:** "Blue Velvet: 676 units sold, growing."
**Chart:** Product-level demand with velocity
**Data:** Real - from sales data

### 4. What categories are growing vs declining?
**Answer:** "Concentrates +23%, Flower -15%."
**Chart:** Category growth comparison (sparklines or bars)
**Data:** Real - from monthly sales

### 5. Which strains/types should I grow?
**Answer:** "Indica is 44% of your sales. Hybrid growing fastest."
**Chart:** Type breakdown with trends
**Data:** Real - from sales data

---

## Pro Preview Sections (Fake Data Until Connected)

### 6. Am I going to run out? ⭐ PRO
**Answer:** "Honeycomb Pave stockout in 18 days at current velocity."
**Chart:** Stockout risk timeline per product
**Preview:** Show with sample data, grayed/blurred
**CTA:** "Connect Metrc to see your real inventory"
**Pro:** Links to Metrc for live inventory levels

### 7. Production Calendar ⭐ PRO
**Answer:** "Start Blue Velvet batch Jan 15 → ready for March demand"
**Chart:** Calendar view matching production to demand forecast
**Preview:** Show beautiful calendar with fake batches
**CTA:** "Connect your production data to plan batches"
**Pro:** Links to their production system or manual entry
- Input lead times per product type
- We translate demand into production schedule
- Alerts: "Start batch X by date Y to meet demand"

### 8. How do I plan production? ⭐ PRO
**Answer:** "To meet 6-month demand: 500 lbs Flower, 200 units Concentrates"
**Chart:** Production requirements table
**Preview:** Show with sample numbers
**CTA:** "Add your capacity to get real production targets"
**Pro:** 
- Input capacity constraints
- We calculate optimal production mix
- Export to spreadsheet/ERP

---

## New Tab Idea: Deliveries

Separate tab for delivery logistics:
- Delivery schedules and routes
- Amounts per delivery
- Real-time updates to retailers (like Amazon tracking)
- "Your order from Grown Rogue ships tomorrow, arrives Thursday"
- Retailer gets: ETA, contents, invoice preview

---

## Pro Features Summary

### Connect Metrc
- Live inventory sync
- Automatic stockout predictions
- Compliance data integrated

### Connect Production Data
- Link to existing systems (spreadsheet, ERP)
- Or manual entry of batches/schedules
- Calendar syncs with demand forecast

### Production Calculator
- Input capacity and lead times
- Demand → Production schedule
- "Start 50 lbs Indica Jan 15 for March delivery"

---

## Data Sources

**Real (we have):**
- `byDate` - daily sales for any timeframe
- `categoryByDate` - category trends
- `typeByDate` - strain type trends
- `products[].byDate` - product velocity
- Extrapolated 6-month demand

**Pro (user provides):**
- Metrc API connection → inventory levels
- Production system link → batch schedules
- Manual entry → lead times, capacity

---

## UX Pattern

1. **Real data sections** - Full interactive charts
2. **Pro preview sections** - Beautiful but obviously sample data
   - Subtle blur or "Sample Data" watermark
   - Compelling enough to want it real
   - Clear CTA to upgrade/connect

---

## Implementation Priority

### Phase 1 (Now)
1. What should I produce next? (category recommendation)
2. How much demand is there? (6-month forecast)
3. Which products have most demand? (product velocity)
4. Category growth comparison
5. Type/strain breakdown

### Phase 2 (Pro Previews)
6. Stockout risk preview (fake data)
7. Production calendar preview (fake data)
8. Production planning preview (fake data)

### Phase 3 (Pro Connections)
- Metrc integration
- Production data import
- Real stockout/calendar features
