import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChevronDown, Calendar } from "lucide-react";

const categoryColors = {
  Flower: "#10b981",
  "Pre-Roll": "#ec4899",
  Cartridges: "#f59e0b",
  Concentrates: "#8b5cf6",
  "Infused Pre-Rolls": "#f43f5e",
  "Edibles (Solid)": "#06b6d4",
};
const typeColors = { Indica: "#6366f1", Hybrid: "#f59e0b", Sativa: "#10b981" };

function consolidateTypes(byType) {
  const c = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([t, v]) => {
    if (t.toLowerCase().includes("indica")) c.Indica += v;
    else if (t.toLowerCase().includes("sativa")) c.Sativa += v;
    else c.Hybrid += v;
  });
  return c;
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
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${value === opt ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
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

function TimeframeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const presets = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },
    { label: "All Time", value: "all" },
    { label: "Custom...", value: "custom" },
  ];

  const displayLabel = presets.find((p) => p.value === value)?.label || value;

  const handlePresetClick = (preset) => {
    if (preset === "custom") {
      setShowCalendar(true);
    } else {
      onChange(preset);
      setOpen(false);
      setShowCalendar(false);
    }
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange(`${customStart} - ${customEnd}`);
      setOpen(false);
      setShowCalendar(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 bg-white"
      >
        <Calendar size={14} className="text-gray-400" />
        <span className="font-medium text-gray-900">{displayLabel}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setOpen(false);
              setShowCalendar(false);
            }}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[200px]">
            {!showCalendar ? (
              presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset.value)}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${value === preset.value ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                >
                  {preset.label}
                </button>
              ))
            ) : (
              <div className="p-3 space-y-3">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Custom Range
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">Start</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCustomApply}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const dp = payload[0]?.payload;

  if (dp?.isForecast) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="text-sm font-medium text-gray-900 mb-1">{label}</div>
        <div className="text-xs text-gray-500 mb-2">
          Forecast range (uncertainty increases over time)
        </div>
        <div className="flex justify-between text-sm gap-4">
          <span className="text-gray-500">Low</span>
          <span className="font-medium">
            ${dp.forecastMin?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm gap-4">
          <span className="text-gray-500">High</span>
          <span className="font-medium">
            ${dp.forecastMax?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <div className="text-sm font-medium text-gray-900 mb-2">
        {label} (Actual)
      </div>
      <div className="text-lg font-semibold">
        ${dp?.value?.toLocaleString()}
      </div>
    </div>
  );
}

export default function ForecastChart({
  selected,
  historyPeak,
  historyTotal,
  forecastMin,
  forecastMax,
  categoryFilter = "All",
  setCategoryFilter,
  typeFilter = "All",
  setTypeFilter,
}) {
  // Use internal state if no external controls provided
  const [internalCategory, setInternalCategory] = useState("All");
  const [internalType, setInternalType] = useState("All");
  const [timeframe, setTimeframe] = useState("all");

  const activeCategory = setCategoryFilter ? categoryFilter : internalCategory;
  const activeType = setTypeFilter ? typeFilter : internalType;
  const onCategoryChange = setCategoryFilter || setInternalCategory;
  const onTypeChange = setTypeFilter || setInternalType;

  const consolidatedTypes = useMemo(
    () => consolidateTypes(selected?.byType),
    [selected],
  );
  const availableCategories = useMemo(
    () => ["All", ...Object.keys(selected?.byCategory || {})],
    [selected],
  );

  // Calculate filtered revenue proportion
  const filterProportion = useMemo(() => {
    if (!selected) return 1;
    let prop = 1;
    if (activeCategory !== "All") {
      prop *= (selected.byCategory?.[activeCategory] || 0) / selected.revenue;
    }
    if (activeType !== "All") {
      prop *= (consolidatedTypes[activeType] || 0) / selected.revenue;
    }
    return prop;
  }, [selected, activeCategory, activeType, consolidatedTypes]);

  // Build chart data - 8 months history + 6 months forecast with widening bands
  const chartData = useMemo(() => {
    if (!selected?.byMonth) return [];

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
    const forecastMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // 6 month forecast
    const data = [];

    // History - actual data, filtered
    historyMonths.forEach((month) => {
      const raw = selected.byMonth[month] || 0;
      const filtered = Math.round(raw * filterProportion);
      data.push({ month, value: filtered, isForecast: false });
    });

    // Forecast - 6 months with widening bands
    const avgMonthly = (selected.revenue / 8) * filterProportion;
    forecastMonths.forEach((month, i) => {
      // Uncertainty widens: 15% at month 1, up to 40% at month 6
      const baseVariance = 0.15;
      const varianceGrowth = 0.05 * i; // grows 5% per month
      const variance = baseVariance + varianceGrowth;

      data.push({
        month: month === "May" || month === "Jun" ? `${month}'26` : month,
        isForecast: true,
        forecastMin: Math.round(avgMonthly * (1 - variance)),
        forecastMax: Math.round(avgMonthly * (1 + variance)),
        value: 0, // no point value for forecast
      });
    });

    return data;
  }, [selected, filterProportion]);

  // Calculate filtered stats
  const filteredHistoryTotal = useMemo(
    () => Math.round(historyTotal * filterProportion),
    [historyTotal, filterProportion],
  );
  const filteredHistoryPeak = useMemo(
    () => Math.round(historyPeak * filterProportion),
    [historyPeak, filterProportion],
  );
  const filteredForecastMin = useMemo(
    () => Math.round(forecastMin * filterProportion * 1.5),
    [forecastMin, filterProportion],
  ); // 6 months
  const filteredForecastMax = useMemo(
    () => Math.round(forecastMax * filterProportion * 1.5),
    [forecastMax, filterProportion],
  );

  if (!selected) return null;

  const filterLabel =
    activeCategory !== "All" || activeType !== "All"
      ? `${activeCategory !== "All" ? activeCategory : ""}${activeCategory !== "All" && activeType !== "All" ? " · " : ""}${activeType !== "All" ? activeType : ""}`
      : "All Products";

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-medium text-gray-900">
            Demand Forecast
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {filterLabel} · 8 months history + 6 months forecast
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TimeframeDropdown value={timeframe} onChange={setTimeframe} />
          <FilterDropdown
            label="Category"
            value={activeCategory}
            options={availableCategories}
            onChange={onCategoryChange}
          />
          <FilterDropdown
            label="Type"
            value={activeType}
            options={["All", "Indica", "Hybrid", "Sativa"]}
            onChange={onTypeChange}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            dx={-8}
          />
          <Tooltip content={<ChartTooltip />} />

          {/* Forecast range band - widening over time */}
          <Area
            type="monotone"
            dataKey="forecastMax"
            stroke="none"
            fill="url(#forecastGradient)"
          />
          <Area
            type="monotone"
            dataKey="forecastMin"
            stroke="none"
            fill="#fff"
          />

          {/* Historical actual data */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#historyGradient)"
            dot={{ fill: "#6366f1", strokeWidth: 0, r: 3 }}
          />

          {/* Divider between actual and forecast */}
          <ReferenceLine x="Dec" stroke="#e5e7eb" strokeDasharray="4 4" />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span>Actual sales</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300" />
          <span>Forecast range (widens over time)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-xs text-gray-500">Peak month</div>
            <div className="text-lg font-semibold text-gray-900">
              ${filteredHistoryPeak.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">8-month actual</div>
            <div className="text-lg font-semibold text-gray-900">
              ${filteredHistoryTotal.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">6-month forecast range</div>
          <div className="text-lg font-semibold text-blue-600">
            ${filteredForecastMin.toLocaleString()} – $
            {filteredForecastMax.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Producer decision context */}
      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="text-sm font-medium text-amber-900 mb-1">
          For your production planning:
        </div>
        <div className="text-sm text-amber-700">
          Flower takes ~4 months to produce + 2 months to sell. Start planning
          now for {activeCategory !== "All" ? activeCategory : "product"} you'll
          deliver in May-June.
        </div>
      </div>
    </div>
  );
}
