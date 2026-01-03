// Consolidate types to 3 buckets
export function consolidateTypes(byType) {
  const c = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([t, v]) => {
    if (t.toLowerCase().includes("indica")) c.Indica += v;
    else if (t.toLowerCase().includes("sativa")) c.Sativa += v;
    else c.Hybrid += v;
  });
  return c;
}

// Get date range for timeframe (returns { start, end } as YYYY-MM-DD strings)
export function getDateRange(timeframe) {
  // Dataset ends at 2025-12-30
  const endDate = "2025-12-30";
  const end = new Date(endDate);

  let start;
  switch (timeframe) {
    case "7d":
      start = new Date(end);
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start = new Date(end);
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start = new Date(end);
      start.setDate(start.getDate() - 90);
      break;
    default: // "all"
      start = new Date("2025-05-01");
  }

  return {
    start: start.toISOString().split("T")[0],
    end: endDate,
  };
}

// Sum byDate data within a date range
export function sumByDateRange(byDate, timeframe) {
  if (!byDate) return { wholesale: 0, units: 0, revenue: 0 };

  const { start, end } = getDateRange(timeframe);
  let wholesale = 0,
    units = 0,
    revenue = 0;

  Object.entries(byDate).forEach(([date, data]) => {
    if (date >= start && date <= end) {
      wholesale += data.wholesale || 0;
      units += data.units || 0;
      revenue += data.revenue || 0;
    }
  });

  return { wholesale, units, revenue };
}

// Aggregate category data by date range
export function getCategoryByDateRange(categoryByDate, timeframe) {
  if (!categoryByDate) return {};

  const { start, end } = getDateRange(timeframe);
  const result = {};

  Object.entries(categoryByDate).forEach(([category, dates]) => {
    let wholesale = 0,
      units = 0;
    Object.entries(dates).forEach(([date, data]) => {
      if (date >= start && date <= end) {
        wholesale += data.wholesale || 0;
        units += data.units || 0;
      }
    });
    if (wholesale > 0) {
      result[category] = { wholesale, units };
    }
  });

  return result;
}

// Aggregate type data by date range
export function getTypeByDateRange(typeByDate, timeframe) {
  if (!typeByDate) return {};

  const { start, end } = getDateRange(timeframe);
  const result = {};

  Object.entries(typeByDate).forEach(([type, dates]) => {
    let wholesale = 0,
      units = 0;
    Object.entries(dates).forEach(([date, data]) => {
      if (date >= start && date <= end) {
        wholesale += data.wholesale || 0;
        units += data.units || 0;
      }
    });
    if (wholesale > 0) {
      result[type] = { wholesale, units };
    }
  });

  return result;
}

// Aggregate product data by date range
export function getProductsByDateRange(products, timeframe) {
  if (!products) return [];

  const { start, end } = getDateRange(timeframe);

  return products
    .map((p) => {
      let wholesale = 0,
        units = 0;
      Object.entries(p.byDate || {}).forEach(([date, data]) => {
        if (date >= start && date <= end) {
          wholesale += data.wholesale || 0;
          units += data.units || 0;
        }
      });
      return {
        ...p,
        wholesale: Math.round(wholesale * 100) / 100,
        units: Math.round(units),
      };
    })
    .filter((p) => p.wholesale > 0)
    .sort((a, b) => b.wholesale - a.wholesale);
}

// Get months for timeframe
export function getTimeframeMonths(timeframe) {
  const allMonths = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  switch (timeframe) {
    case "30d":
      return ["Dec"];
    case "90d":
      return ["Oct", "Nov", "Dec"];
    default:
      return allMonths;
  }
}

// Calculate trend from monthly data
export function calculateTrend(byMonth, timeframe) {
  const months = getTimeframeMonths(timeframe);
  const values = months.map((m) => byMonth?.[m] || 0);
  if (values.length < 2) return { delta: 0, trend: "flat" };
  const recent = values.slice(-1)[0];
  const older = values[0];
  const pct = older > 0 ? Math.round(((recent - older) / older) * 100) : 0;
  return { delta: pct, trend: pct > 5 ? "up" : pct < -5 ? "down" : "flat" };
}

// Get most recent month with data
export function getCurrentMonth() {
  return "Dec"; // Most recent month in dataset
}

// Generate rankings based on timeframe
export function generateRankings(
  selected,
  brands,
  category,
  strainType,
  timeframe = "30d",
) {
  const months = getTimeframeMonths(timeframe);

  const relevant = brands.filter((b) => {
    // Must have data in at least one month of timeframe
    const hasData = months.some((m) => b.wholesaleByMonth?.[m] > 0);
    if (!hasData) return false;
    if (category !== "All" && !b.wholesaleByCategory?.[category]) return false;
    if (strainType !== "All") {
      const types = consolidateTypes(b.wholesaleByType || {});
      if (!types[strainType]) return false;
    }
    return true;
  });

  const withWholesale = relevant
    .map((b) => {
      // Sum wholesale across timeframe months
      const timeframeTotal = months.reduce(
        (sum, m) => sum + (b.wholesaleByMonth?.[m] || 0),
        0,
      );
      let wholesale = timeframeTotal;

      // For category/type filtering, estimate based on ratios
      if (category !== "All") {
        const catRatio =
          (b.wholesaleByCategory?.[category] || 0) / (b.wholesale || 1);
        wholesale = timeframeTotal * catRatio;
      }
      if (strainType !== "All") {
        const types = consolidateTypes(b.wholesaleByType || {});
        const typeRatio = (types[strainType] || 0) / (b.wholesale || 1);
        wholesale = wholesale * typeRatio;
      }
      return {
        ...b,
        segmentWholesale: wholesale,
        timeframeWholesale: timeframeTotal,
      };
    })
    .sort((a, b) => b.segmentWholesale - a.segmentWholesale);

  const idx = withWholesale.findIndex((b) => b.id === selected.id);
  if (idx === -1) return null;

  return {
    rank: idx + 1,
    total: withWholesale.length,
    month: months[months.length - 1],
    above: withWholesale.slice(Math.max(0, idx - 2), idx),
    selected: withWholesale[idx],
    below: withWholesale.slice(idx + 1, idx + 3),
  };
}
