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

// Unit labels by category - what producers actually measure at aggregate level
const categoryUnits = {
  Flower: { label: "lbs", short: "lbs", perDollar: 0.00088 }, // ~$1,134/lb wholesale
  Concentrates: { label: "grams", short: "g", perDollar: 0.1 }, // ~$10/gram wholesale
  Cartridges: { label: "carts", short: "carts", perDollar: 0.07 }, // ~$14/cart wholesale
  "Pre-Roll": { label: "packs", short: "packs", perDollar: 0.2 }, // ~$5/pack wholesale
  "Infused Pre-Rolls": { label: "packs", short: "packs", perDollar: 0.1 }, // ~$10/pack wholesale
  "Edibles (Solid)": { label: "packs", short: "packs", perDollar: 0.25 }, // ~$4/pack wholesale
  default: { label: "units", short: "units", perDollar: 0.33 }, // fallback ~$3/unit
};

function getUnitInfo(category) {
  return categoryUnits[category] || categoryUnits.default;
}

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

function ChartTooltip({ active, payload, label, displayMode, unitLabel }) {
  if (!active || !payload?.length) return null;
  const dp = payload[0]?.payload;
  const isUnits = displayMode === "units";

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
            {isUnits
              ? `${dp.forecastMin?.toLocaleString()} ${unitLabel}`
              : `$${dp.forecastMin?.toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between text-sm gap-4">
          <span className="text-gray-500">High</span>
          <span className="font-medium">
            {isUnits
              ? `${dp.forecastMax?.toLocaleString()} ${unitLabel}`
              : `$${dp.forecastMax?.toLocaleString()}`}
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
        {isUnits
          ? `${dp?.value?.toLocaleString()} ${unitLabel}`
          : `$${dp?.value?.toLocaleString()}`}
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
  timeframe: externalTimeframe,
  setTimeframe: externalSetTimeframe,
}) {
  // Use internal state if no external controls provided
  const [internalCategory, setInternalCategory] = useState("All");
  const [internalType, setInternalType] = useState("All");
  const [internalTimeframe, setInternalTimeframe] = useState("all");
  const [displayMode, setDisplayMode] = useState("wholesale"); // "wholesale" or "units"

  const timeframe = externalSetTimeframe
    ? externalTimeframe
    : internalTimeframe;
  const setTimeframe = externalSetTimeframe || setInternalTimeframe;

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

  // Calculate filtered wholesale proportion
  const filterProportion = useMemo(() => {
    if (!selected) return 1;
    const total = selected.wholesale || 1;
    let prop = 1;
    if (activeCategory !== "All") {
      prop *= (selected.wholesaleByCategory?.[activeCategory] || 0) / total;
    }
    if (activeType !== "All") {
      const wholesaleTypes = consolidateTypes(
        selected.wholesaleByType || selected.byType,
      );
      prop *= (wholesaleTypes[activeType] || 0) / total;
    }
    return prop;
  }, [selected, activeCategory, activeType]);

  // Get months to show based on timeframe
  const getTimeframeMonths = (tf) => {
    const allMonths = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    switch (tf) {
      case "today":
      case "week":
        return ["Dec"]; // Most recent
      case "30d":
        return ["Dec"]; // Last month
      case "90d":
        return ["Oct", "Nov", "Dec"]; // Last 3 months
      case "all":
      default:
        return allMonths;
    }
  };

  // Get unit info based on selected category
  const unitInfo = getUnitInfo(
    activeCategory === "All" ? "default" : activeCategory,
  );

  // Convert wholesale to units based on category
  const wholesaleToUnits = (wholesale) =>
    Math.round(wholesale * unitInfo.perDollar);

  // Build chart data - history + 6 months forecast with widening bands
  // Use wholesale data (what producer earns) instead of retail revenue
  const chartData = useMemo(() => {
    if (!selected?.byMonth) return [];

    const historyMonths = getTimeframeMonths(timeframe);
    const forecastMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // 6 month forecast
    const data = [];

    // Use wholesaleByMonth if available, otherwise calculate from revenue
    const monthlyData = selected.wholesaleByMonth || {};
    const hasWholesaleData = Object.keys(monthlyData).length > 0;

    // History - actual wholesale data, filtered
    historyMonths.forEach((month) => {
      const rawWholesale = hasWholesaleData
        ? monthlyData[month] || 0
        : (selected.byMonth[month] || 0) * 0.45; // fallback to 45% of retail
      const filteredWholesale = Math.round(rawWholesale * filterProportion);
      const value =
        displayMode === "units"
          ? wholesaleToUnits(filteredWholesale)
          : filteredWholesale;
      data.push({ month, value, isForecast: false });
    });

    // Forecast - 6 months with widening bands (based on filtered history average)
    const historyTotal = historyMonths.reduce(
      (sum, m) =>
        sum +
        (hasWholesaleData
          ? monthlyData[m] || 0
          : (selected.byMonth[m] || 0) * 0.45),
      0,
    );
    const avgMonthlyWholesale =
      (historyTotal / historyMonths.length) * filterProportion;
    const avgMonthly =
      displayMode === "units"
        ? wholesaleToUnits(avgMonthlyWholesale)
        : avgMonthlyWholesale;

    // Get the last actual value to connect forecast smoothly
    const lastActualValue =
      data.length > 0 ? data[data.length - 1].value : avgMonthly;

    forecastMonths.forEach((month, i) => {
      // Uncertainty widens: 15% at month 1, up to 40% at month 6
      const baseVariance = 0.15;
      const varianceGrowth = 0.05 * i; // grows 5% per month
      const variance = baseVariance + varianceGrowth;

      // First forecast point starts from last actual value, then transitions to average
      const forecastMid = i === 0 ? lastActualValue : avgMonthly;

      data.push({
        month: month === "May" || month === "Jun" ? `${month}'26` : month,
        isForecast: true,
        forecastMin: Math.round(forecastMid * (1 - variance)),
        forecastMax: Math.round(forecastMid * (1 + variance)),
        // Bridge value connects history to forecast on first point only
        value: i === 0 ? lastActualValue : undefined,
      });
    });

    return data;
  }, [selected, filterProportion, timeframe, displayMode]);

  // Calculate filtered wholesale stats
  const filteredWholesaleTotal = useMemo(() => {
    const monthlyData = selected?.wholesaleByMonth || {};
    const hasWholesaleData = Object.keys(monthlyData).length > 0;
    const historyMonths = getTimeframeMonths(timeframe);
    const total = historyMonths.reduce(
      (sum, m) =>
        sum +
        (hasWholesaleData
          ? monthlyData[m] || 0
          : (selected?.byMonth?.[m] || 0) * 0.45),
      0,
    );
    return Math.round(total * filterProportion);
  }, [selected, filterProportion, timeframe]);

  const filteredWholesalePeak = useMemo(() => {
    const monthlyData = selected?.wholesaleByMonth || {};
    const hasWholesaleData = Object.keys(monthlyData).length > 0;
    const historyMonths = getTimeframeMonths(timeframe);
    const peak = historyMonths.reduce((max, m) => {
      const val = hasWholesaleData
        ? monthlyData[m] || 0
        : (selected?.byMonth?.[m] || 0) * 0.45;
      return val > max ? val : max;
    }, 0);
    return Math.round(peak * filterProportion);
  }, [selected, filterProportion, timeframe]);

  const filteredForecastMin = useMemo(() => {
    const avgMonthly =
      filteredWholesaleTotal / getTimeframeMonths(timeframe).length;
    return Math.round(avgMonthly * 6 * 0.85); // 6 months, conservative
  }, [filteredWholesaleTotal, timeframe]);

  const filteredForecastMax = useMemo(() => {
    const avgMonthly =
      filteredWholesaleTotal / getTimeframeMonths(timeframe).length;
    return Math.round(avgMonthly * 6 * 1.15); // 6 months, optimistic
  }, [filteredWholesaleTotal, timeframe]);

  if (!selected) return null;

  const filterLabel =
    activeCategory !== "All" || activeType !== "All"
      ? `${activeCategory !== "All" ? activeCategory : ""}${activeCategory !== "All" && activeType !== "All" ? " · " : ""}${activeType !== "All" ? activeType : ""}`
      : "All Products";

  const timeframeLabel =
    {
      today: "Today",
      week: "This Week",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
      all: "All Time (8 months)",
    }[timeframe] || timeframe;

  // Stats adjusted for display mode
  const displayTotal =
    displayMode === "units"
      ? wholesaleToUnits(filteredWholesaleTotal)
      : filteredWholesaleTotal;
  const displayPeak =
    displayMode === "units"
      ? wholesaleToUnits(filteredWholesalePeak)
      : filteredWholesalePeak;
  const displayForecastMin =
    displayMode === "units"
      ? wholesaleToUnits(filteredForecastMin)
      : filteredForecastMin;
  const displayForecastMax =
    displayMode === "units"
      ? wholesaleToUnits(filteredForecastMax)
      : filteredForecastMax;

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-medium text-gray-900">
            Demand Forecast
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {filterLabel} · {timeframeLabel} + 6 months forecast
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Wholesale/Units toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setDisplayMode("wholesale")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                displayMode === "wholesale"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setDisplayMode("units")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                displayMode === "units"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Units
            </button>
          </div>
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
          margin={{ top: 10, right: 10, left: 50, bottom: 0 }}
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
            tickFormatter={(v) => {
              if (displayMode === "units") {
                // For small values (< 1000), show raw number; otherwise use K
                return v < 1000
                  ? `${Math.round(v)} ${unitInfo.short}`
                  : `${(v / 1000).toFixed(1)}K ${unitInfo.short}`;
              }
              return `$${(v / 1000).toFixed(0)}K`;
            }}
            dx={-8}
          />
          <Tooltip
            content={
              <ChartTooltip
                displayMode={displayMode}
                unitLabel={unitInfo.label}
              />
            }
          />

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
          <span>Actual revenue</span>
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
              {displayMode === "units"
                ? displayPeak.toLocaleString()
                : `$${displayPeak.toLocaleString()}`}
              {displayMode === "units" && (
                <span className="text-sm text-gray-500 ml-1">
                  {unitInfo.label}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">
              {displayMode === "units"
                ? `Total ${unitInfo.label}`
                : "Total revenue"}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {displayMode === "units"
                ? displayTotal.toLocaleString()
                : `$${displayTotal.toLocaleString()}`}
              {displayMode === "units" && (
                <span className="text-sm text-gray-500 ml-1">
                  {unitInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">6-month forecast</div>
          <div className="text-lg font-semibold text-blue-600">
            {displayMode === "units"
              ? `${displayForecastMin.toLocaleString()} – ${displayForecastMax.toLocaleString()} ${unitInfo.label}`
              : `$${displayForecastMin.toLocaleString()} – $${displayForecastMax.toLocaleString()}`}
          </div>
        </div>
      </div>
    </div>
  );
}
