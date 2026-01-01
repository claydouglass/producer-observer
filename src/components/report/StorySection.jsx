import React from "react";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function StorySection({ selected }) {
  const monthlyData = Object.entries(selected.byMonth || {});
  if (monthlyData.length === 0) return null;

  // Find peak and calculate decline
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
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Story</h2>

      {/* Visual bars - simple and clear */}
      <div className="space-y-3 mb-8">
        {monthlyData.map(([month, revenue]) => {
          const pct = Math.round((revenue / peak.value) * 100);
          const isPeak = revenue === peak.value;

          return (
            <div key={month} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium text-gray-500">
                {month}
              </div>
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isPeak ? "bg-green-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-20 text-right">
                <span className="font-semibold text-gray-900">
                  ${(revenue / 1000).toFixed(1)}K
                </span>
                {isPeak && (
                  <span className="ml-2 text-xs text-green-600">Peak</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* The insight - emotional, clear */}
      {hasDecline ? (
        <div className="bg-amber-50 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-amber-600" size={24} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg mb-1">
              Sales dropped {Math.abs(change)}% since {peak.month}
            </div>
            <div className="text-gray-600">
              Your peak was ${(peak.value / 1000).toFixed(1)}K in {peak.month}.
              Let's figure out what changed and get you back up there.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg mb-1">
              You're holding steady
            </div>
            <div className="text-gray-600">
              Keep it up. There's still room to grow - check out the
              opportunities below.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
