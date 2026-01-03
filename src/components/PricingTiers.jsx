import React, { useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { formatUnits } from "../utils/rankings";

// Determine price tier from unit price
function getTier(wholesale, units) {
  if (!units || units === 0) return null;
  const unitPrice = wholesale / units;

  // Filter out obvious bad data (unit price > $100 is likely data error)
  if (unitPrice > 100) return null;

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

// Expandable tier row component
function TierRow({ tier, tierColor }) {
  const [expanded, setExpanded] = useState(false);

  // Sort products by revenue descending
  const sortedProducts = [...tier.products].sort(
    (a, b) => b.wholesale - a.wholesale,
  );

  // Download CSV for this tier
  const downloadCSV = (e) => {
    e.stopPropagation();
    const headers = [
      "Rank",
      "Product",
      "Category",
      "Qty",
      "Unit",
      "Revenue",
      "$/unit",
    ];
    const rows = sortedProducts.map((p, i) => {
      const unitInfo = formatUnits(p.units, p.category);
      const unitPrice = p.units > 0 ? (p.wholesale / p.units).toFixed(2) : "";
      return [
        i + 1,
        `"${p.name.split("|")[0].trim()}"`,
        p.category,
        unitInfo.value,
        unitInfo.label,
        p.wholesale.toFixed(2),
        unitPrice,
      ];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tier.name.replace(/[^a-zA-Z0-9]/g, "_")}_products.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center p-3 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-8 rounded ${tierColor || "bg-gray-400"}`} />
          <div className="text-left">
            <span className="font-medium text-gray-900">{tier.name}</span>
            <span className="text-sm text-gray-500 ml-2">
              {tier.count} {tier.count === 1 ? "product" : "products"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-semibold text-gray-900">
              ${tier.revenue.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-2">{tier.pct}%</span>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 bg-white">
          <div className="flex justify-end px-3 py-2 border-b border-gray-100">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
              title="Download CSV"
            >
              <Download size={14} />
              CSV
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  #
                </th>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  Product
                </th>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  Category
                </th>
                <th className="text-right px-3 py-2 text-gray-500 font-medium">
                  Qty
                </th>
                <th className="text-right px-3 py-2 text-gray-500 font-medium">
                  Revenue
                </th>
                <th className="text-right px-3 py-2 text-gray-500 font-medium">
                  $/unit
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p, i) => {
                const unitInfo = formatUnits(p.units, p.category);
                const unitPrice =
                  p.units > 0 ? (p.wholesale / p.units).toFixed(2) : "—";
                return (
                  <tr
                    key={p.name}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {p.name.split("|")[0].trim()}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{p.category}</td>
                    <td className="px-3 py-2 text-right">
                      <span className="font-medium text-gray-900">
                        {unitInfo.value}
                      </span>
                      <span className="text-gray-400 ml-1">
                        {unitInfo.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-green-600 font-medium">
                      ${p.wholesale.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      ${unitPrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

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
          <TierRow key={t.name} tier={t} tierColor={TIER_COLORS[t.name]} />
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
