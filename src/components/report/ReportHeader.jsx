import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ReportHeader({ selected, brands = [] }) {
  const totalBrands = brands.length || 174;

  // Determine trend from monthly data
  const months = Object.values(
    selected.wholesaleByMonth || selected.byMonth || {},
  );
  const recent = months.slice(-2);
  const trendPct =
    recent.length >= 2 && recent[0] > 0
      ? Math.round(((recent[1] - recent[0]) / recent[0]) * 100)
      : 0;
  const trend = trendPct > 5 ? "up" : trendPct < -5 ? "down" : "flat";

  // KPI data
  const kpis = [
    {
      label: "Rank",
      value: `#${selected.rank}`,
      sub: `of ${totalBrands} brands`,
      trend,
      delta: trendPct !== 0 ? `${trendPct > 0 ? "+" : ""}${trendPct}%` : null,
    },
    {
      label: "Revenue",
      value: `$${Math.round((selected.wholesale || 0) / 1000)}K`,
      sub: "all time",
    },
    {
      label: "Units",
      value: (
        selected.units || Math.round((selected.wholesale || 0) / 3)
      ).toLocaleString(),
      sub: "sold",
    },
    {
      label: "Transactions",
      value: (selected.transactions || 0).toLocaleString(),
      sub: "total",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Brand header - simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{selected.name}</h1>
          <p className="text-gray-500">Intel Report · Miracle Greens Bend</p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            trend === "up"
              ? "bg-green-50 text-green-700"
              : trend === "down"
                ? "bg-red-50 text-red-700"
                : "bg-gray-50 text-gray-600"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={18} />
          ) : trend === "down" ? (
            <TrendingDown size={18} />
          ) : (
            <Minus size={18} />
          )}
          <span className="font-medium">
            {trend === "up"
              ? "Growing"
              : trend === "down"
                ? "Declining"
                : "Steady"}
          </span>
        </div>
      </div>

      {/* KPI Cards - matching ForecastTab style */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-gray-200 bg-white"
          >
            <div className="text-sm text-gray-500 mb-1">{kpi.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">
                {kpi.value}
              </span>
              {kpi.delta && (
                <span
                  className={`text-sm font-medium ${
                    kpi.trend === "up"
                      ? "text-green-600"
                      : kpi.trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {kpi.delta}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
