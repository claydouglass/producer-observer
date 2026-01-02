import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Target } from "lucide-react";

function getTrendIcon(trend) {
  if (trend === "growing") return <TrendingUp size={14} className="text-green-500" />;
  if (trend === "declining") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

function getTrendColor(trend) {
  if (trend === "growing") return "text-green-600";
  if (trend === "declining") return "text-red-500";
  return "text-gray-500";
}

export default function ProductForecast({ selected }) {
  const [expanded, setExpanded] = useState(false);

  const forecast = selected.forecast?.sixMonth;
  if (!forecast) return null;

  const { total, byCategory, byProduct } = forecast;

  // Sort categories by forecast value (max)
  const sortedCategories = Object.entries(byCategory || {})
    .sort((a, b) => b[1].max - a[1].max);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-indigo-500" />
          <span className="font-semibold text-gray-900">6-Month Demand Forecast</span>
        </div>
        <div className="text-sm text-gray-500">
          Flower takes 4 months to produce
        </div>
      </div>

      {/* Total forecast range */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 mb-4">
        <div className="text-sm text-gray-500 mb-1">Projected wholesale (next 6 months)</div>
        <div className="text-3xl font-bold text-gray-900">
          ${total.min.toLocaleString()} – ${total.max.toLocaleString()}
        </div>
      </div>

      {/* Category breakdown - simple bars */}
      <div className="space-y-3 mb-4">
        <div className="text-sm font-medium text-gray-500">By Category</div>
        {sortedCategories.map(([category, data]) => {
          const pct = (data.max / total.max) * 100;
          return (
            <div key={category} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700 truncate">{category}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.trend === "growing" ? "bg-green-400" :
                    data.trend === "declining" ? "bg-red-300" :
                    "bg-indigo-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center gap-2 w-36 justify-end">
                {getTrendIcon(data.trend)}
                <span className={`text-sm font-medium ${getTrendColor(data.trend)}`}>
                  ${data.min.toLocaleString()}–${data.max.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand for product-level */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        {expanded ? "Hide" : "See"} product-level forecast
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && byProduct && (
        <div className="mt-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Product</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">Last 30 Days</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">90-Day Forecast</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">6-Month Forecast</th>
                </tr>
              </thead>
              <tbody>
                {byProduct.map((p) => (
                  <tr key={p.name} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{p.units30d} units</td>
                    <td className="px-4 py-2 text-right text-gray-600">{p.forecast90d} units</td>
                    <td className="px-4 py-2 text-right font-medium text-indigo-600">{p.forecast180d} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Simple insight */}
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
            Based on current velocity, plan production for <strong>{byProduct.reduce((sum, p) => sum + p.forecast180d, 0).toLocaleString()} units</strong> over the next 6 months. Start flower now for Q3 delivery.
          </div>
        </div>
      )}
    </div>
  );
}
