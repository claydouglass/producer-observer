import React from "react";

// Determine price tier from unit price
function getTier(wholesale, units) {
  if (!units || units === 0) return null;
  const unitPrice = wholesale / units;

  if (unitPrice >= 15) return "Ultra ($15+)";
  if (unitPrice >= 10) return "Premium ($10-15)";
  if (unitPrice >= 7) return "Mid ($7-10)";
  if (unitPrice >= 4) return "Value ($4-7)";
  return "Budget (<$4)";
}

const TIER_ORDER = [
  "Ultra ($15+)",
  "Premium ($10-15)",
  "Mid ($7-10)",
  "Value ($4-7)",
  "Budget (<$4)",
];

const TIER_COLORS = {
  "Ultra ($15+)": "bg-purple-500",
  "Premium ($10-15)": "bg-blue-500",
  "Mid ($7-10)": "bg-green-500",
  "Value ($4-7)": "bg-yellow-500",
  "Budget (<$4)": "bg-gray-400",
};

export default function PricingTiers({ products = [] }) {
  if (!products.length) {
    return (
      <p className="text-gray-500 text-sm">
        Product-level pricing data not yet available for this brand.
      </p>
    );
  }

  // Group by tier (calculated from unit price)
  const tierGroups = {};
  products.forEach((p) => {
    const tier = p.tier || getTier(p.wholesale, p.units);
    if (!tier) return;
    if (!tierGroups[tier])
      tierGroups[tier] = { count: 0, revenue: 0, products: [] };
    tierGroups[tier].count++;
    tierGroups[tier].revenue += p.wholesale || 0;
    tierGroups[tier].products.push(p);
  });

  const totalRevenue = Object.values(tierGroups).reduce(
    (sum, t) => sum + t.revenue,
    0,
  );

  if (totalRevenue === 0) {
    return (
      <p className="text-gray-500 text-sm">Pricing tier data not available.</p>
    );
  }

  // Sort by tier order
  const tiers = TIER_ORDER.filter((name) => tierGroups[name]).map((name) => ({
    name,
    ...tierGroups[name],
    pct: Math.round((tierGroups[name].revenue / totalRevenue) * 100),
  }));

  // Check for gaps
  const hasUltra = tiers.some((t) => t.name.includes("Ultra"));
  const hasPremium = tiers.some((t) => t.name.includes("Premium"));

  return (
    <div className="space-y-4">
      {/* Horizontal stacked bar */}
      <div className="h-8 flex rounded-lg overflow-hidden">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`${TIER_COLORS[t.name] || "bg-gray-400"} flex items-center justify-center`}
            style={{ width: `${t.pct}%` }}
            title={`${t.name}: ${t.pct}%`}
          >
            {t.pct >= 10 && (
              <span className="text-xs text-white font-medium">{t.pct}%</span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {tiers.map((t) => (
          <div key={t.name} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded ${TIER_COLORS[t.name] || "bg-gray-400"}`}
            />
            <span className="text-sm text-gray-700">{t.name}</span>
            <span className="text-sm text-gray-500">({t.count})</span>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="space-y-2">
        {tiers.map((t) => (
          <div
            key={t.name}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-8 rounded ${TIER_COLORS[t.name] || "bg-gray-400"}`}
              />
              <div>
                <span className="font-medium text-gray-900">{t.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {t.count} products
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                ${t.revenue.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-2">{t.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Opportunity callout */}
      {!hasUltra && !hasPremium && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          No premium products. Market opportunity exists in higher tiers.
        </div>
      )}
    </div>
  );
}
