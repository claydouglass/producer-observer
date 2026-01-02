import React, { useState, useMemo } from "react";
import {
  Flame,
  TrendingUp,
  TrendingDown,
  Lock,
  ChevronRight,
} from "lucide-react";
import KPICard from "./KPICard";
import ForecastChart from "./ForecastChart";
import POInsights from "./POInsights";

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

// Calculate real deltas from monthly data
function calculateTrend(byMonth) {
  const months = Object.values(byMonth || {});
  if (months.length < 4) return { delta: 0, trend: "flat" };
  const recent = months.slice(-2).reduce((a, b) => a + b, 0) / 2;
  const older = months.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
  const pct = older > 0 ? Math.round(((recent - older) / older) * 100) : 0;
  return { delta: pct, trend: pct > 5 ? "up" : pct < -5 ? "down" : "flat" };
}

// Generate rankings from real data
function generateRankings(selected, brands, category, strainType) {
  const relevant = brands.filter((b) => {
    if (
      category !== "All" &&
      (!b.byCategory?.[category] || b.byCategory[category] === 0)
    )
      return false;
    if (strainType !== "All") {
      const types = consolidateTypes(b.byType);
      if (!types[strainType] || types[strainType] === 0) return false;
    }
    return true;
  });

  const withRevenue = relevant
    .map((b) => {
      let rev = b.revenue;
      if (category !== "All") rev = b.byCategory?.[category] || 0;
      if (strainType !== "All") {
        const ratio = consolidateTypes(b.byType)[strainType] / b.revenue;
        rev = rev * ratio;
      }
      return { ...b, segmentRevenue: rev };
    })
    .sort((a, b) => b.segmentRevenue - a.segmentRevenue);

  const idx = withRevenue.findIndex((b) => b.id === selected.id);
  if (idx === -1) return null;

  return {
    rank: idx + 1,
    total: withRevenue.length,
    above: withRevenue.slice(Math.max(0, idx - 2), idx),
    selected: withRevenue[idx],
    below: withRevenue.slice(idx + 1, idx + 3),
  };
}

export default function ForecastTab({
  selected,
  historyPeak,
  historyTotal,
  forecastMin,
  forecastMax,
  brands = [],
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  if (!selected) return null;

  const trend = calculateTrend(selected.byMonth);
  const consolidatedTypes = consolidateTypes(selected.byType);
  const categories = ["All", ...Object.keys(selected.byCategory || {})];
  const ranking = useMemo(
    () => generateRankings(selected, brands, selectedCategory, selectedType),
    [selected, brands, selectedCategory, selectedType],
  );

  // Calculate filter proportion for KPIs
  const filterProportion = useMemo(() => {
    if (selectedCategory === "All" && selectedType === "All") return 1;
    let prop = 1;
    if (selectedCategory !== "All") {
      prop *= (selected.byCategory?.[selectedCategory] || 0) / selected.revenue;
    }
    if (selectedType !== "All") {
      const types = consolidateTypes(selected.byType);
      prop *= (types[selectedType] || 0) / selected.revenue;
    }
    return prop;
  }, [selected, selectedCategory, selectedType]);

  // Filtered values for KPIs
  const filteredRevenue = Math.round(selected.revenue * filterProportion);
  const filteredCustomers = Math.round(selected.customers * filterProportion);
  const filteredTransactions = Math.round(
    selected.transactions * filterProportion,
  );
  const filteredMarketShare = (selected.marketShare * filterProportion).toFixed(
    2,
  );

  // Derive KPIs from real data - now filter-responsive
  const kpis = [
    {
      label: "Rank",
      value: ranking ? `#${ranking.rank}` : `#${selected.rank}`,
      sub: ranking
        ? `of ${ranking.total} brands`
        : `of ${brands.length || 174} brands`,
      delta:
        trend.trend === "up" ? `+${Math.abs(trend.delta)}%` : `${trend.delta}%`,
      trend: trend.trend,
    },
    {
      label: "Revenue",
      value: `$${filteredRevenue.toLocaleString()}`,
      sub:
        selectedCategory !== "All" || selectedType !== "All"
          ? `${selectedCategory !== "All" ? selectedCategory : ""}${selectedCategory !== "All" && selectedType !== "All" ? " / " : ""}${selectedType !== "All" ? selectedType : ""}`
          : "total sales",
    },
    {
      label: "Customers",
      value: filteredCustomers.toLocaleString(),
      sub: "unique buyers",
    },
    {
      label: "Transactions",
      value: filteredTransactions.toLocaleString(),
      sub: "total sales",
    },
  ];

  const typeColors = {
    Indica: "#6366f1",
    Hybrid: "#f59e0b",
    Sativa: "#10b981",
  };
  const catColors = {
    Flower: "#10b981",
    Cartridges: "#f59e0b",
    Concentrates: "#8b5cf6",
    "Pre-Roll": "#ec4899",
    "Infused Pre-Rolls": "#f43f5e",
  };

  const typeData = Object.entries(consolidatedTypes)
    .filter(([_, v]) => v > 0)
    .map(([name, revenue]) => ({
      name,
      revenue,
      pct: Math.round((revenue / selected.revenue) * 100),
      color: typeColors[name],
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const categoryData = Object.entries(selected.byCategory || {})
    .map(([name, revenue]) => ({
      name,
      revenue,
      pct: Math.round((revenue / selected.revenue) * 100),
      color: catColors[name] || "#9ca3af",
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Chart with filters on top */}
      <ForecastChart
        selected={selected}
        historyPeak={historyPeak}
        historyTotal={historyTotal}
        forecastMin={forecastMin}
        forecastMax={forecastMax}
        categoryFilter={selectedCategory}
        setCategoryFilter={setSelectedCategory}
        typeFilter={selectedType}
        setTypeFilter={setSelectedType}
      />

      {/* KPIs - now below chart and filter-responsive */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* PO Insights - why we order what we order */}
      <POInsights selected={selected} />

      {/* Competitive Ranking */}
      {ranking && (
        <div className="p-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />
              <span className="font-semibold text-gray-900">
                Your Ranking
                {(selectedCategory !== "All" || selectedType !== "All") && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({selectedCategory !== "All" ? selectedCategory : ""}
                    {selectedCategory !== "All" && selectedType !== "All"
                      ? " / "
                      : ""}
                    {selectedType !== "All" ? selectedType : ""})
                  </span>
                )}
              </span>
            </div>
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
                  ${Math.round(b.segmentRevenue).toLocaleString()}
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
                ${Math.round(ranking.selected.segmentRevenue).toLocaleString()}
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
                    ${Math.round(b.segmentRevenue).toLocaleString()}
                  </div>
                  <div className="text-xs text-red-600">
                    $
                    {Math.round(
                      ranking.selected.segmentRevenue - b.segmentRevenue,
                    ).toLocaleString()}{" "}
                    behind
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type breakdown */}
      {typeData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">By Type</div>
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
                  ${t.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{t.pct}% of sales</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {categoryData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            By Category
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
                  ${c.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{c.pct}% of sales</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
