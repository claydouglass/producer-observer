import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const categoryColors = {
  Flower: "#10b981",
  "Pre-Roll": "#ec4899",
  Cartridges: "#f59e0b",
  Concentrates: "#8b5cf6",
  Edibles: "#06b6d4",
  "Infused Pre-Rolls": "#f43f5e",
  "Edibles (Solid)": "#06b6d4",
  Accessories: "#9ca3af",
};

// Simplified to 3 types
const typeColors = {
  Indica: "#6366f1",
  Hybrid: "#f59e0b",
  Sativa: "#10b981",
};

// Consolidate granular types into 3 buckets
function consolidateTypes(byType) {
  const consolidated = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([type, value]) => {
    if (type.toLowerCase().includes("indica")) {
      consolidated.Indica += value;
    } else if (type.toLowerCase().includes("sativa")) {
      consolidated.Sativa += value;
    } else {
      consolidated.Hybrid += value;
    }
  });
  return consolidated;
}

function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 bg-white"
      >
        <span className="text-gray-500">{label}:</span>
        <span className="font-medium text-gray-900">{value}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
                  value === opt ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StackedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[160px]">
      <div className="text-sm font-medium text-gray-900 mb-2">{label}</div>
      {payload
        .filter((p) => p.value > 0)
        .map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs mb-1"
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-gray-600">{p.dataKey}</span>
            </div>
            <span className="font-medium text-gray-900">
              ${p.value.toLocaleString()}
            </span>
          </div>
        ))}
      <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between text-xs">
        <span className="text-gray-500">Total</span>
        <span className="font-semibold text-gray-900">
          ${Math.round(total).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function ForecastChart({
  chartData,
  historyPeak,
  historyTotal,
  forecastMin,
  forecastMax,
  selected,
}) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewMode, setViewMode] = useState("category");

  const availableCategories = useMemo(() => {
    if (!selected?.byCategory) return ["All"];
    return ["All", ...Object.keys(selected.byCategory)];
  }, [selected]);

  // Simplified types
  const availableTypes = ["All", "Indica", "Hybrid", "Sativa"];

  // Get consolidated types for this brand
  const consolidatedTypes = useMemo(() => {
    return consolidateTypes(selected?.byType);
  }, [selected]);

  // Build stacked chart data
  const stackedChartData = useMemo(() => {
    if (!selected?.byMonth || !selected?.byCategory) return chartData;

    const monthOrder = [
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
    ];
    const historyMonths = [
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the breakdown based on view mode
    const breakdown =
      viewMode === "category" ? selected.byCategory : consolidatedTypes;
    const totalRevenue = selected.revenue;

    return monthOrder.map((month) => {
      const monthTotal = selected.byMonth[month] || 0;
      const isHistory = historyMonths.includes(month);
      const dataPoint = { month, type: isHistory ? "history" : "forecast" };

      if (isHistory) {
        Object.entries(breakdown).forEach(([key, catTotal]) => {
          const proportion = catTotal / totalRevenue;
          dataPoint[key] = Math.round(monthTotal * proportion);
        });
      } else {
        const avgMonthly = totalRevenue / 8;
        Object.entries(breakdown).forEach(([key, catTotal]) => {
          const proportion = catTotal / totalRevenue;
          dataPoint[key] = Math.round(avgMonthly * proportion);
        });
      }

      return dataPoint;
    });
  }, [selected, viewMode, chartData, consolidatedTypes]);

  // Get keys for stacking
  const stackKeys = useMemo(() => {
    if (!selected) return [];
    const breakdown =
      viewMode === "category" ? selected.byCategory : consolidatedTypes;
    return Object.keys(breakdown || {})
      .filter((k) => breakdown[k] > 0)
      .sort((a, b) => breakdown[b] - breakdown[a]);
  }, [selected, viewMode, consolidatedTypes]);

  const colors = viewMode === "category" ? categoryColors : typeColors;

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-medium text-gray-900">
            Performance & Forecast
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            May 2025 – Apr 2026
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("category")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "category"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              By Category
            </button>
            <button
              onClick={() => setViewMode("type")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "type"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              By Type
            </button>
          </div>
          <FilterDropdown
            label="Category"
            value={categoryFilter}
            options={availableCategories}
            onChange={setCategoryFilter}
          />
          <FilterDropdown
            label="Type"
            value={typeFilter}
            options={availableTypes}
            onChange={setTypeFilter}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={stackedChartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {stackKeys.map((key) => (
              <linearGradient
                key={key}
                id={`gradient-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colors[key] || "#9ca3af"}
                  stopOpacity={0.6}
                />
                <stop
                  offset="100%"
                  stopColor={colors[key] || "#9ca3af"}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            dx={-8}
          />
          <Tooltip content={<StackedTooltip />} />
          {stackKeys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={colors[key] || "#9ca3af"}
              fill={`url(#gradient-${key})`}
              strokeWidth={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 flex-wrap">
        {stackKeys.map((key) => (
          <div
            key={key}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: colors[key] || "#9ca3af" }}
            />
            <span>{key}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-xs text-gray-500">Historical peak</div>
            <div className="text-lg font-semibold text-gray-900">
              ${historyPeak.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Historical total</div>
            <div className="text-lg font-semibold text-gray-900">
              ${historyTotal.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">4-mo forecast range</div>
          <div className="text-lg font-semibold text-blue-600">
            ${forecastMin.toLocaleString()} – ${forecastMax.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
