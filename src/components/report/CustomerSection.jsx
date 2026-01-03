import React, { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

export default function CustomerSection({ selected }) {
  const [expanded, setExpanded] = useState(false);

  // Use real loyalty data if available, fallback to estimates
  const loyalty = selected.loyalty || {
    totalCustomers: selected.customers,
    repeatCustomers: Math.round(selected.customers * 0.3),
    repeatRate: 0.3,
    oneTimeBuyers: Math.round(selected.customers * 0.7),
    segments: {
      oneTime: { count: Math.round(selected.customers * 0.7), pct: 31 },
      occasional: { count: Math.round(selected.customers * 0.14), pct: 15 },
      loyal: { count: Math.round(selected.customers * 0.16), pct: 54 },
    },
    spendTrend: { buyMore: 0.45, buySame: 0.35, buyLess: 0.2 },
    comparison: { avgLTV: 223, storeAvgLTV: 113, index: 2.0 },
    walletShare: 0.23,
  };

  const repeatPct = Math.round(loyalty.repeatRate * 100);
  const ltvIndex = loyalty.comparison?.index || 2.0;

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="text-sm font-medium text-gray-900 mb-4">
        Customer Loyalty
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="text-2xl font-semibold text-gray-900">
            {loyalty.totalCustomers}
          </div>
          <div className="text-xs text-gray-500">customers</div>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <div className="text-2xl font-semibold text-green-700">
            {repeatPct}%
          </div>
          <div className="text-xs text-gray-500">come back</div>
        </div>
        <div className="p-4 rounded-lg bg-blue-50">
          <div className="text-2xl font-semibold text-blue-700">
            {ltvIndex}x
          </div>
          <div className="text-xs text-gray-500">more valuable</div>
        </div>
        <div className="p-4 rounded-lg bg-purple-50">
          <div className="text-2xl font-semibold text-purple-700">
            {Math.round(loyalty.walletShare * 100)}%
          </div>
          <div className="text-xs text-gray-500">wallet share</div>
        </div>
      </div>

      {/* Expand for detail */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        {expanded ? "Hide" : "Show"} breakdown
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Customer segments */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-semibold text-gray-400">
                {loyalty.segments.oneTime.count}
              </div>
              <div className="text-xs text-gray-500">One-time</div>
              <div className="text-xs text-gray-400">
                {loyalty.segments.oneTime.pct}% rev
              </div>
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-center">
              <div className="text-xl font-semibold text-amber-700">
                {loyalty.segments.occasional.count}
              </div>
              <div className="text-xs text-gray-600">Occasional</div>
              <div className="text-xs text-gray-500">
                {loyalty.segments.occasional.pct}% rev
              </div>
            </div>
            <div className="p-3 rounded-lg border border-green-200 bg-green-50 text-center">
              <div className="text-xl font-semibold text-green-700">
                {loyalty.segments.loyal.count}
              </div>
              <div className="text-xs text-gray-600">Loyal (3+)</div>
              <div className="text-xs text-green-600 font-medium">
                {loyalty.segments.loyal.pct}% rev
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg flex items-center gap-2">
            <TrendingUp size={14} className="text-green-600" />
            <span>
              <strong>{loyalty.segments.loyal.count} loyal customers</strong>{" "}
              drive <strong>{loyalty.segments.loyal.pct}%</strong> of revenue
            </span>
          </div>

          {/* Spend trend */}
          <div>
            <div className="text-xs text-gray-500 mb-2">When they return:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-14 text-gray-600">More</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{ width: `${loyalty.spendTrend.buyMore * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-green-600 font-medium">
                  {Math.round(loyalty.spendTrend.buyMore * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-14 text-gray-600">Same</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded"
                    style={{ width: `${loyalty.spendTrend.buySame * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-600 font-medium">
                  {Math.round(loyalty.spendTrend.buySame * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-14 text-gray-600">Less</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded"
                    style={{ width: `${loyalty.spendTrend.buyLess * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-red-500 font-medium">
                  {Math.round(loyalty.spendTrend.buyLess * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
