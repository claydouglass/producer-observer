import React from "react";
import KPICard from "./KPICard";
import ForecastChart from "./ForecastChart";

export default function ForecastTab({
  chartData,
  selected,
  forecastTotal,
  historyPeak,
  historyTotal,
  forecastMin,
  forecastMax,
}) {
  if (!selected) return null;

  // Build KPIs from selected entity
  const kpis = [
    {
      label: "Rank",
      value: `#${selected.rank}`,
      sub: "of 174 brands",
      delta: "+3",
    },
    {
      label: "Market Share",
      value: `${selected.marketShare}%`,
      sub: "of store revenue",
      delta: "+0.4%",
    },
    {
      label: "Customers",
      value: selected.customers.toString(),
      sub: "unique buyers",
      delta: "+8%",
    },
    {
      label: "Transactions",
      value: selected.transactions.toString(),
      sub: "total sales",
      delta: "+12%",
    },
  ];

  // Build type breakdown from selected entity
  const typeColors = {
    Indica: "#6366f1",
    "Indica-dom": "#818cf8",
    Sativa: "#10b981",
    "Sativa-dom": "#34d399",
    Hybrid: "#f59e0b",
    "50/50": "#fbbf24",
  };

  const typeData = Object.entries(selected.byType || {})
    .map(([name, revenue]) => ({
      name,
      revenue,
      pct: Math.round((revenue / selected.revenue) * 100),
      color: typeColors[name] || "#9ca3af",
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // Build category breakdown from selected entity
  const catColors = {
    Flower: "#10b981",
    Cartridges: "#f59e0b",
    Concentrates: "#8b5cf6",
    "Pre-Roll": "#ec4899",
    "Edibles (Solid)": "#06b6d4",
    "Infused Pre-Rolls": "#f43f5e",
  };

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
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      <ForecastChart
        chartData={chartData}
        historyPeak={historyPeak}
        historyTotal={historyTotal}
        forecastMin={forecastMin}
        forecastMax={forecastMax}
      />

      {typeData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            By strain type
          </div>
          <div className="grid grid-cols-4 gap-4">
            {typeData.map((type) => (
              <div
                key={type.name}
                className="p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm text-gray-600">{type.name}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${type.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  {type.pct}% of sales
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categoryData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            By category
          </div>
          <div className="grid grid-cols-4 gap-4">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className="p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${cat.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{cat.pct}% of sales</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
