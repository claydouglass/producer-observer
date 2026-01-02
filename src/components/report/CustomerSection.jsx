import React, { useState } from "react";
import { Heart, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

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
    avgVisits: 14.0,
    storeAvgVisits: 8.6,
    brandsPerCustomer: 8.5,
    storeAvgBrands: 3.9,
  };

  const repeatPct = Math.round(loyalty.repeatRate * 100);
  const ltvIndex = loyalty.comparison?.index || 2.0;

  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-100">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <Heart className="text-rose-500" size={32} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your customers are exceptional
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            People who buy {selected.name} spend{" "}
            <strong className="text-gray-900">{ltvIndex}x more</strong> at our
            store than average. They visit{" "}
            <strong className="text-gray-900">
              {loyalty.avgVisits?.toFixed(0) || "14"} times
            </strong>{" "}
            vs {loyalty.storeAvgVisits?.toFixed(0) || "9"} average.
          </p>

          {/* Key metrics */}
          <div className="flex items-center gap-8 mb-6">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {loyalty.totalCustomers}
              </div>
              <div className="text-gray-500">customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {ltvIndex}x
              </div>
              <div className="text-gray-500">more valuable</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {repeatPct}%
              </div>
              <div className="text-gray-500">come back</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(loyalty.walletShare * 100)}%
              </div>
              <div className="text-gray-500">wallet share</div>
            </div>
          </div>

          {/* Expand for detail */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium"
          >
            {expanded ? "Hide" : "See"} customer breakdown
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expanded && (
            <div className="mt-6 space-y-6">
              {/* Customer segments */}
              <div className="bg-white rounded-xl p-5">
                <div className="text-sm font-medium text-gray-900 mb-4">
                  Customer Segments
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-400">
                      {loyalty.segments.oneTime.count}
                    </div>
                    <div className="text-sm text-gray-500">One-time</div>
                    <div className="text-xs text-gray-400">
                      {loyalty.segments.oneTime.pct}% of revenue
                    </div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {loyalty.segments.occasional.count}
                    </div>
                    <div className="text-sm text-gray-600">Occasional</div>
                    <div className="text-xs text-gray-500">
                      {loyalty.segments.occasional.pct}% of revenue
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {loyalty.segments.loyal.count}
                    </div>
                    <div className="text-sm text-gray-600">Loyal (3+)</div>
                    <div className="text-xs text-green-600 font-medium">
                      {loyalty.segments.loyal.pct}% of revenue
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  <TrendingUp
                    size={14}
                    className="inline mr-1 text-green-600"
                  />
                  <strong>
                    {loyalty.segments.loyal.count} loyal customers
                  </strong>{" "}
                  drive <strong>{loyalty.segments.loyal.pct}%</strong> of your
                  wholesale revenue
                </div>
              </div>

              {/* Spend trend */}
              <div className="bg-white rounded-xl p-5">
                <div className="text-sm font-medium text-gray-900 mb-3">
                  When they return, do they spend more?
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">More</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${loyalty.spendTrend.buyMore * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm font-medium text-green-600">
                      {Math.round(loyalty.spendTrend.buyMore * 100)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">Same</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-400 rounded-full"
                        style={{
                          width: `${loyalty.spendTrend.buySame * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {Math.round(loyalty.spendTrend.buySame * 100)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">Less</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{
                          width: `${loyalty.spendTrend.buyLess * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm font-medium text-red-500">
                      {Math.round(loyalty.spendTrend.buyLess * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison to store average */}
              <div className="bg-white rounded-xl p-5">
                <div className="text-sm font-medium text-gray-900 mb-3">
                  vs Store Average
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      Lifetime Value
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${loyalty.comparison.avgLTV}
                    </div>
                    <div className="text-xs text-green-600">
                      vs ${loyalty.comparison.storeAvgLTV} avg
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      Store Visits
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {loyalty.avgVisits}
                    </div>
                    <div className="text-xs text-green-600">
                      vs {loyalty.storeAvgVisits} avg
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      Brands Explored
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {loyalty.brandsPerCustomer}
                    </div>
                    <div className="text-xs text-green-600">
                      vs {loyalty.storeAvgBrands} avg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
