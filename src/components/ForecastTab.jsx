import React, { useState, useMemo } from "react";
import { Flame, TrendingUp, TrendingDown } from "lucide-react";
import KPICard from "./KPICard";
import ForecastChart from "./ForecastChart";
import POInsights from "./POInsights";
import RankHistory from "./RankHistory";
import ProductForecast from "./ProductForecast";

// Consolidate types to 3 buckets
function consolidateTypes(byType) {
  const c = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([t, v]) => {
    if (t.toLowerCase().includes("indica")) c.Indica += v;
    else if (t.toLowerCase().includes("sativa")) c.Sativa += v;
    else c.Hybrid += v;
  });
  return c;
}

// Get months for timeframe
function getTimeframeMonths(timeframe) {
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
function calculateTrend(byMonth, timeframe) {
  const months = getTimeframeMonths(timeframe);
  const values = months.map((m) => byMonth?.[m] || 0);
  if (values.length < 2) return { delta: 0, trend: "flat" };
  const recent = values.slice(-1)[0];
  const older = values[0];
  const pct = older > 0 ? Math.round(((recent - older) / older) * 100) : 0;
  return { delta: pct, trend: pct > 5 ? "up" : pct < -5 ? "down" : "flat" };
}

// Generate rankings from real data
function generateRankings(selected, brands, category, strainType) {
  const relevant = brands.filter((b) => {
    if (category !== "All" && !b.wholesaleByCategory?.[category]) return false;
    if (strainType !== "All") {
      const types = consolidateTypes(b.wholesaleByType || {});
      if (!types[strainType]) return false;
    }
    return true;
  });

  const withWholesale = relevant
    .map((b) => {
      let wholesale = b.wholesale || 0;
      if (category !== "All")
        wholesale = b.wholesaleByCategory?.[category] || 0;
      if (strainType !== "All") {
        const types = consolidateTypes(b.wholesaleByType || {});
        const ratio = types[strainType] / (b.wholesale || 1);
        wholesale = wholesale * ratio;
      }
      return { ...b, segmentWholesale: wholesale };
    })
    .sort((a, b) => b.segmentWholesale - a.segmentWholesale);

  const idx = withWholesale.findIndex((b) => b.id === selected.id);
  if (idx === -1) return null;

  return {
    rank: idx + 1,
    total: withWholesale.length,
    above: withWholesale.slice(Math.max(0, idx - 2), idx),
    selected: withWholesale[idx],
    below: withWholesale.slice(idx + 1, idx + 3),
  };
}

export default function ForecastTab({ selected, brands = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [timeframe, setTimeframe] = useState("all");

  if (!selected) return null;

  const categories = [
    "All",
    ...Object.keys(selected.wholesaleByCategory || {}),
  ];

  // Calculate timeframe-filtered wholesale
  const timeframeWholesale = useMemo(() => {
    const months = getTimeframeMonths(timeframe);
    const monthlyData = selected.wholesaleByMonth || {};
    return months.reduce((sum, m) => sum + (monthlyData[m] || 0), 0);
  }, [selected, timeframe]);

  // Calculate filter proportion for category/type
  const filterProportion = useMemo(() => {
    if (selectedCategory === "All" && selectedType === "All") return 1;
    const total = selected.wholesale || 1;
    let prop = 1;
    if (selectedCategory !== "All") {
      prop *= (selected.wholesaleByCategory?.[selectedCategory] || 0) / total;
    }
    if (selectedType !== "All") {
      const types = consolidateTypes(selected.wholesaleByType || {});
      prop *= (types[selectedType] || 0) / total;
    }
    return prop;
  }, [selected, selectedCategory, selectedType]);

  // Filtered wholesale (timeframe + category/type)
  const filteredWholesale = Math.round(timeframeWholesale * filterProportion);

  // Estimate units from wholesale (rough: $3/unit average)
  const filteredUnits = Math.round(filteredWholesale / 3);

  // Customers and transactions scaled by timeframe
  const timeframeRatio = getTimeframeMonths(timeframe).length / 8;
  const filteredCustomers = Math.round(
    selected.customers * timeframeRatio * filterProportion,
  );
  const filteredTransactions = Math.round(
    selected.transactions * timeframeRatio * filterProportion,
  );

  // Trend based on timeframe
  const trend = calculateTrend(selected.wholesaleByMonth, timeframe);

  // Ranking
  const ranking = useMemo(
    () => generateRankings(selected, brands, selectedCategory, selectedType),
    [selected, brands, selectedCategory, selectedType],
  );

  // Filter label
  const filterLabel =
    selectedCategory !== "All" || selectedType !== "All"
      ? `${selectedCategory !== "All" ? selectedCategory : ""}${selectedCategory !== "All" && selectedType !== "All" ? " / " : ""}${selectedType !== "All" ? selectedType : ""}`
      : null;

  // Timeframe label for KPIs
  const timeframeLabel =
    timeframe === "30d"
      ? "Last 30 days"
      : timeframe === "90d"
        ? "Last 90 days"
        : "All time";

  // KPIs - now timeframe and filter responsive
  const kpis = [
    {
      label: "Rank",
      value: ranking ? `#${ranking.rank}` : `#${selected.rank}`,
      sub: ranking ? `of ${ranking.total}` : `of ${brands.length || 174}`,
      delta:
        trend.trend === "up" ? `+${Math.abs(trend.delta)}%` : `${trend.delta}%`,
      trend: trend.trend,
    },
    {
      label: "Revenue",
      value: `$${filteredWholesale.toLocaleString()}`,
      sub: timeframeLabel,
    },
    {
      label: "Units",
      value: filteredUnits.toLocaleString(),
      sub: timeframeLabel,
    },
    {
      label: "Transactions",
      value: filteredTransactions.toLocaleString(),
      sub: timeframeLabel,
    },
  ];

  // Type data - WHOLESALE only
  const typeColors = {
    Indica: "#6366f1",
    Hybrid: "#f59e0b",
    Sativa: "#10b981",
  };
  const wholesaleTypes = consolidateTypes(selected.wholesaleByType || {});
  const typeData = Object.entries(wholesaleTypes)
    .filter(([_, v]) => v > 0)
    .map(([name, wholesale]) => ({
      name,
      wholesale: Math.round(
        wholesale *
          (timeframe === "30d" ? 0.125 : timeframe === "90d" ? 0.375 : 1),
      ),
      pct: Math.round((wholesale / (selected.wholesale || 1)) * 100),
      color: typeColors[name],
    }))
    .sort((a, b) => b.wholesale - a.wholesale);

  // Category data - WHOLESALE only
  const catColors = {
    Flower: "#10b981",
    Cartridges: "#f59e0b",
    Concentrates: "#8b5cf6",
    "Pre-Roll": "#ec4899",
    "Infused Pre-Rolls": "#f43f5e",
  };
  const categoryData = Object.entries(selected.wholesaleByCategory || {})
    .map(([name, wholesale]) => ({
      name,
      wholesale: Math.round(
        wholesale *
          (timeframe === "30d" ? 0.125 : timeframe === "90d" ? 0.375 : 1),
      ),
      pct: Math.round((wholesale / (selected.wholesale || 1)) * 100),
      color: catColors[name] || "#9ca3af",
    }))
    .sort((a, b) => b.wholesale - a.wholesale);

  return (
    <div className="space-y-6">
      {/* Chart with filters */}
      <ForecastChart
        selected={selected}
        categoryFilter={selectedCategory}
        setCategoryFilter={setSelectedCategory}
        typeFilter={selectedType}
        setTypeFilter={setSelectedType}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
      />

      {/* KPIs - timeframe and filter responsive */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Production Insights */}
      <POInsights selected={selected} />

      {/* Rankings Over Time */}
      <RankHistory selected={selected} />

      {/* 6-Month Product Forecast */}
      <ProductForecast selected={selected} />

      {/* Competitive Ranking */}
      {ranking && (
        <div className="p-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-500" />
            <span className="font-semibold text-gray-900">Your Ranking</span>
            {filterLabel && (
              <span className="text-sm text-gray-500">({filterLabel})</span>
            )}
          </div>

          <div className="space-y-1">
            {ranking.above.map((b, i) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                    {ranking.rank - (ranking.above.length - i)}
                  </div>
                  <span className="font-medium text-gray-700">{b.name}</span>
                </div>
                <span className="font-semibold text-gray-700">
                  ${Math.round(b.segmentWholesale).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-blue-600">
                  {ranking.rank}
                </div>
                <div>
                  <div className="font-bold">
                    {selected.name}{" "}
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">
                      YOU
                    </span>
                  </div>
                  <div className="text-xs text-blue-200">
                    #{ranking.rank} of {ranking.total}
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">
                $
                {Math.round(ranking.selected.segmentWholesale).toLocaleString()}
              </div>
            </div>

            {ranking.below.map((b, i) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm font-bold text-red-600">
                    {ranking.rank + i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">{b.name}</div>
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <TrendingUp size={10} />
                      Gaining
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-700">
                    ${Math.round(b.segmentWholesale).toLocaleString()}
                  </div>
                  <div className="text-xs text-red-600">
                    $
                    {Math.round(
                      ranking.selected.segmentWholesale - b.segmentWholesale,
                    ).toLocaleString()}{" "}
                    behind
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type breakdown - Wholesale */}
      {typeData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            Revenue by Type
          </div>
          <div className="grid grid-cols-3 gap-4">
            {typeData.map((t) => (
              <div
                key={t.name}
                className="p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="font-medium text-gray-700">{t.name}</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  ${t.wholesale.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{t.pct}% of revenue</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown - Wholesale */}
      {categoryData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            Revenue by Category
          </div>
          <div className="grid grid-cols-4 gap-4">
            {categoryData.map((c) => (
              <div
                key={c.name}
                className="p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-sm text-gray-600">{c.name}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${c.wholesale.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{c.pct}% of revenue</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
