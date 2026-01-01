# Phase 3: Performance Loop

**Compare forecasts to outcomes and self-calibrate**

---

## 3.1 Store Forecast Snapshots

When a forecast is generated, save it:

```javascript
{
  id: 'forecast-2025-01',
  createdAt: '2025-01-15',
  scenario: 'base',
  decisions: { indicaSupply: true, ... },
  predictions: {
    'Jan-2026': { base: 1850, min: 1480, max: 2220 },
    'Feb-2026': { base: 2050, min: 1640, max: 2460 },
    ...
  }
}
```

---

## 3.2 Compare to Actuals

When new sales data arrives:

```javascript
const evaluateForecast = (forecastId) => {
  const forecast = getForecast(forecastId);
  const actuals = getActualSales(forecast.period);
  
  return {
    accuracy: calculateAccuracy(forecast.predictions, actuals),
    bias: calculateBias(forecast.predictions, actuals),
    adjustments: suggestCalibration(forecast, actuals)
  };
};
```

---

## 3.3 Calibrate Future Predictions

Use outcome data to adjust multipliers:

| If Prediction Was | Adjustment |
|-------------------|------------|
| Consistently high | Reduce scenario multipliers |
| Consistently low | Increase base forecast |
| Wrong on category | Adjust category multipliers |
| Wrong on seasonality | Update monthly patterns |

---

## 3.4 Dashboard Shows Learning

Add to Partnership tab:

```
Forecast Accuracy: 87.1% → Show trend over time
Last Calibration: 3 days ago
Adjustment Applied: +2.3% to Cartridges forecast
```

---

## 3.5 The Closed Loop

```
1. System predicts
2. User takes actions  
3. Reality happens (new CSV data)
4. System measures accuracy
5. System adjusts multipliers
6. Next prediction is sharper
```

---

## Outcome

After Phase 3:
- Forecasts get **more accurate over time**
- System **learns from its mistakes**
- Users see **confidence increase** with each cycle

---

[← Previous: Phase 2](./07-phase2-feedback-loop.md) | [Back to Roadmap →](./05-implementation-roadmap.md)
