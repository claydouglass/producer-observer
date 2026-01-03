# Phase 1: Structured Memory

**Replace hardcoded data with a structured, persistent data layer**

---

## 1.1 Parse CSV Data into Structured Format

The CSV files contain real operational data:

| File | Contains |
|------|----------|
| `Sold Items` | Actual sales by product, category, customer |
| `Inventory Activity` | Batch imports, stock levels, suppliers |

**Action:** Create a data pipeline that:
- Parses CSVs into normalized structures
- Calculates actual monthly revenue by type/category
- Derives real KPIs (rank, market share, customer count)

---

## 1.2 Create Relational Data Model

Connect entities like Vervana does:

```
Brand (Oregrown)
  └── Products
       ├── Category (Flower, Cartridges, etc.)
       ├── Type (Indica, Sativa, Hybrid)
       └── Sales History
            └── Monthly aggregates
```

---

## 1.3 Replace Static Constants

| Current File | Replace With |
|--------------|--------------|
| `baseData.js` | Calculated from CSV sales data |
| `kpiData` in constants | Derived from actual performance |
| `typeBreakdown` | Aggregated from real sales mix |
| `categoryBreakdown` | Aggregated from real sales mix |

---

## Example: Parsing Sales Data

```javascript
// src/utils/parseCSV.js
export const aggregateMonthlySales = (salesData) => {
  const byMonth = {};
  
  salesData.forEach(row => {
    const month = extractMonth(row['Completed At']);
    const amount = parseFloat(row['Total Collected']);
    byMonth[month] = (byMonth[month] || 0) + amount;
  });
  
  return Object.entries(byMonth).map(([month, total]) => ({
    month,
    base: Math.round(total),
    type: isHistorical(month) ? 'history' : 'forecast'
  }));
};
```

---

## Outcome

After Phase 1:
- Dashboard shows **real historical data**
- KPIs reflect **actual performance**
- Type/category breakdowns match **real sales mix**

---

[← Back to Roadmap](./05-implementation-roadmap.md) | [Next: Phase 2 →](./07-phase2-feedback-loop.md)
