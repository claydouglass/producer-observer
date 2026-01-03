import React from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export default function StorySection({ selected }) {
  const rawMonthlyData = selected.wholesaleByMonth || selected.byMonth || {};
  const useWholesale = !!selected.wholesaleByMonth;

  const monthlyData = Object.entries(rawMonthlyData).map(([month, value]) => [
    month,
    useWholesale ? value : Math.round(value * 0.45),
  ]);

  if (monthlyData.length === 0) return null;

  // Find peak and calculate change
  const peak = monthlyData.reduce(
    (max, [m, v]) => (v > max.value ? { month: m, value: v } : max),
    { month: "", value: 0 },
  );
  const recent = monthlyData[monthlyData.length - 1];
  const change =
    peak.value > 0
      ? Math.round(((recent[1] - peak.value) / peak.value) * 100)
      : 0;
  const hasDecline = change < -20;

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="text-sm font-medium text-gray-900 mb-4">
        Monthly Trend
      </div>

      {/* Visual bars */}
      <div className="space-y-2 mb-6">
        {monthlyData.map(([month, wholesale]) => {
          const pct = Math.round((wholesale / peak.value) * 100);
          const isPeak = wholesale === peak.value;

          return (
            <div key={month} className="flex items-center gap-3">
              <div className="w-10 text-xs font-medium text-gray-500">
                {month}
              </div>
              <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all ${isPeak ? "bg-green-500" : "bg-indigo-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm font-medium text-gray-900">
                ${(wholesale / 1000).toFixed(1)}K
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      {hasDecline ? (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
          <AlertTriangle
            className="text-amber-600 flex-shrink-0 mt-0.5"
            size={18}
          />
          <div>
            <div className="font-medium text-gray-900">
              Down {Math.abs(change)}% since {peak.month}
            </div>
            <div className="text-sm text-gray-600">
              Peak was ${(peak.value / 1000).toFixed(1)}K
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
          <TrendingUp
            className="text-green-600 flex-shrink-0 mt-0.5"
            size={18}
          />
          <div>
            <div className="font-medium text-gray-900">Holding steady</div>
            <div className="text-sm text-gray-600">
              Peak was ${(peak.value / 1000).toFixed(1)}K in {peak.month}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
