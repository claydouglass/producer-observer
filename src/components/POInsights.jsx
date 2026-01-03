import React from "react";
import { Package, DollarSign, Target } from "lucide-react";

function generateProducerInsights(selected) {
  if (!selected?.byMonth || !selected?.wholesaleByCategory)
    return { what: [], howMuch: [], price: [] };

  const categories = Object.entries(selected.wholesaleByCategory).sort(
    (a, b) => b[1] - a[1],
  );
  const months = Object.entries(selected.wholesaleByMonth || {});
  const totalWholesale = selected.wholesale || 0;
  const avgMonthlyWholesale = totalWholesale / 8;

  // Find trends from wholesale data
  const recentAvg = months.slice(-3).reduce((s, [_, v]) => s + v, 0) / 3;
  const olderAvg = months.slice(0, 3).reduce((s, [_, v]) => s + v, 0) / 3;
  const trendPct =
    olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0;

  const insights = { what: [], howMuch: [], price: [] };

  // WHAT TO PRODUCE
  const topCat = categories[0];
  if (topCat) {
    const pct = Math.round((topCat[1] / totalWholesale) * 100);
    insights.what.push({
      category: topCat[0],
      pct,
      message: `${topCat[0]} is ${pct}% of your revenue. Double down.`,
    });
  }

  if (categories.length > 1) {
    const secondCat = categories[1];
    const secondPct = Math.round((secondCat[1] / totalWholesale) * 100);
    if (secondPct > 15) {
      insights.what.push({
        category: secondCat[0],
        pct: secondPct,
        message: `${secondCat[0]} is ${secondPct}%. Consider expanding.`,
      });
    }
  }

  // HOW MUCH
  const monthlyWholesale = Math.round(avgMonthlyWholesale);
  const sixMonthWholesale = Math.round(avgMonthlyWholesale * 6);

  insights.howMuch.push({
    timeframe: "Monthly",
    amount: monthlyWholesale,
    message: `Demand: $${monthlyWholesale.toLocaleString()}/mo revenue`,
  });

  insights.howMuch.push({
    timeframe: "6-month",
    amount: sixMonthWholesale,
    message: `Plan for $${sixMonthWholesale.toLocaleString()} over 6 months`,
  });

  if (trendPct < -15) {
    insights.howMuch.push({
      timeframe: "Warning",
      amount: trendPct,
      message: `Down ${Math.abs(trendPct)}%. Adjust production.`,
      warning: true,
    });
  } else if (trendPct > 15) {
    insights.howMuch.push({
      timeframe: "Opportunity",
      amount: trendPct,
      message: `Up ${trendPct}%. Increase supply.`,
      positive: true,
    });
  }

  // WHOLESALE PRICING
  const avgTransaction =
    selected.transactions > 0
      ? Math.round(totalWholesale / selected.transactions)
      : 0;
  insights.price.push({
    metric: "Avg revenue/sale",
    value: avgTransaction,
    message: `$${avgTransaction} revenue per transaction`,
  });

  return insights;
}

export default function POInsights({ selected }) {
  const insights = generateProducerInsights(selected);
  if (!insights.what.length && !insights.howMuch.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-lg font-semibold text-gray-900 mb-4">
        Your Production Playbook
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* WHAT TO PRODUCE */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold text-gray-700">
              What to Produce
            </span>
          </div>
          <div className="space-y-2">
            {insights.what.map((w, i) => (
              <div key={i} className="p-3 bg-indigo-50 rounded-lg">
                <div className="font-medium text-indigo-900">{w.category}</div>
                <div className="text-sm text-indigo-700">{w.message}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW MUCH */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-green-500" />
            <span className="text-sm font-semibold text-gray-700">
              How Much
            </span>
          </div>
          <div className="space-y-2">
            {insights.howMuch.map((h, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${h.warning ? "bg-red-50" : "bg-green-50"}`}
              >
                <div
                  className={`font-medium ${h.warning ? "text-red-900" : "text-green-900"}`}
                >
                  {h.timeframe}
                </div>
                <div
                  className={`text-sm ${h.warning ? "text-red-700" : "text-green-700"}`}
                >
                  {h.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHOLESALE PRICE */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} className="text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">Pricing</span>
          </div>
          <div className="space-y-2">
            {insights.price.map((p, i) => (
              <div key={i} className="p-3 bg-amber-50 rounded-lg">
                <div className="font-medium text-amber-900">${p.value}</div>
                <div className="text-sm text-amber-700">{p.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
