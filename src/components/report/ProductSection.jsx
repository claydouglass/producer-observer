import React from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import ExpandableSection from "./ExpandableSection";

// Mock product data - would come from API
function getProductData(selected) {
  const products = [
    { name: "Honeycomb Pave |I|", category: "Flower", revenue: 3453, units: 451, margin: 71, trend: "down" },
    { name: "Hash Burger |I/H|", category: "Flower", revenue: 2416, units: 680, margin: 63, trend: "stable" },
    { name: "Military Chocolate |H|", category: "Flower", revenue: 1656, units: 222, margin: 71, trend: "up" },
    { name: "High Desert Sour Sage |S|", category: "Flower", revenue: 1494, units: 165, margin: 71, trend: "up" },
    { name: "Amaretto Sour |H|", category: "Flower", revenue: 849, units: 226, margin: 65, trend: "stable" },
    { name: "Mac-1 AIO 1g LR Cart", category: "Cartridges", revenue: 202, units: 6, margin: 51, trend: "up" },
    { name: "Gary Payton AIO 1g LR Cart", category: "Cartridges", revenue: 200, units: 6, margin: 50, trend: "up" },
    { name: "Papaya 1g Rosin", category: "Concentrates", revenue: 166, units: 6, margin: 40, trend: "up" },
  ];

  const underperformers = [
    { name: "The Hive 1g Rosin", category: "Concentrates", revenue: 20, transactions: 1, daysSinceLaunch: 14 },
    { name: "Block Berry Trail Pack", category: "Infused Pre-Roll", revenue: 22, transactions: 1, daysSinceLaunch: 65 },
    { name: "Cold Snap 1g CR Cart", category: "Cartridges", revenue: 24, transactions: 1, daysSinceLaunch: 21 },
  ];

  const tiers = [
    { tier: "Budget ($1-4)", products: "Hash Burger, Amaretto Sour", yourRevenue: 2074, marketRevenue: 64628, share: 3.2 },
    { tier: "Value ($5-6)", products: "Various", yourRevenue: 1193, marketRevenue: 40443, share: 3.0 },
    { tier: "Mid ($7-9)", products: "Honeycomb Pave, Military Choc", yourRevenue: 4505, marketRevenue: 35359, share: 12.7 },
    { tier: "Premium ($10-12)", products: "High Desert Sour Sage", yourRevenue: 2023, marketRevenue: 11806, share: 17.1 },
    { tier: "Ultra ($13+)", products: "Limited", yourRevenue: 73, marketRevenue: 22621, share: 0.3 },
  ];

  return { products, underperformers, tiers };
}

export default function ProductSection({ selected }) {
  const { products, underperformers, tiers } = getProductData(selected);
  const topProducts = products.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Performance</h2>
      <p className="text-gray-500 mb-6">What's working and what needs attention</p>

      {/* Top Products Summary */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Top Performers
        </div>
        <div className="grid grid-cols-5 gap-3">
          {topProducts.map((p, i) => (
            <div key={p.name} className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">#{i + 1}</div>
              <div className="font-medium text-gray-900 text-sm truncate" title={p.name}>
                {p.name.split("|")[0].trim()}
              </div>
              <div className="text-lg font-bold text-gray-900">${(p.revenue / 1000).toFixed(1)}K</div>
              <div className="flex items-center gap-1 mt-1">
                {p.trend === "up" && <TrendingUp size={12} className="text-green-500" />}
                {p.trend === "down" && <TrendingDown size={12} className="text-red-500" />}
                <span className="text-xs text-gray-500">{p.units} units</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Details */}
      <div className="space-y-3">
        <ExpandableSection
          title="All Products"
          summary={`${products.length} products`}
          downloadData={products}
          downloadFilename="products.csv"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-right">Units</th>
                <th className="pb-2 text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.name} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2 text-gray-500">{p.category}</td>
                  <td className="py-2 text-right">${p.revenue.toLocaleString()}</td>
                  <td className="py-2 text-right">{p.units}</td>
                  <td className="py-2 text-right">{p.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ExpandableSection>

        <ExpandableSection
          title="Price Tier Performance"
          summary="Mid & Premium strongest"
          downloadData={tiers}
          downloadFilename="tier-performance.csv"
        >
          <div className="space-y-3">
            {tiers.map((t) => (
              <div key={t.tier} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{t.tier}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${t.share > 10 ? "bg-green-500" : t.share > 5 ? "bg-amber-500" : "bg-gray-300"}`}
                      style={{ width: `${Math.min(t.share * 5, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium">{t.share}% share</div>
                <div className="w-24 text-right text-sm text-gray-500">${(t.yourRevenue / 1000).toFixed(1)}K</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-violet-50 rounded-lg text-sm text-violet-700">
            You dominate Mid and Premium tiers (12-17% share) but are underweight in Ultra ($13+).
          </div>
        </ExpandableSection>

        <ExpandableSection
          title="Underperforming Products"
          summary={`${underperformers.length} need attention`}
          downloadData={underperformers}
          downloadFilename="underperformers.csv"
        >
          <div className="space-y-2">
            {underperformers.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-red-500" />
                  <div>
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">{p.transactions} sale{p.transactions > 1 ? "s" : ""}</div>
                  <div className="text-xs text-gray-500">{p.daysSinceLaunch} days on shelf</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Consider discontinuing products with fewer than 3 transactions over 60+ days.
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
}
