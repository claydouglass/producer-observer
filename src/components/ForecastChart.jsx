import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export default function ForecastChart({
  chartData,
  historyPeak,
  historyTotal,
  forecastMin,
  forecastMax,
}) {
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
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rangeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2196f3" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#2196f3" stopOpacity={0.05} />
            </linearGradient>
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
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="max"
            stroke="none"
            fill="url(#rangeFill)"
          />
          <Area type="monotone" dataKey="min" stroke="none" fill="white" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2196f3"
            strokeWidth={2}
            fill="none"
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (!cx || !cy) return null;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload.type === "history" ? "#9ca3af" : "#2196f3"}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span>History</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Forecast</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-6 h-3 rounded bg-blue-100" />
          <span>Range</span>
        </div>
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
