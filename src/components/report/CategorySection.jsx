import React from "react";

// Consolidate types to 3 buckets
function consolidateTypes(byType) {
  const c = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([t, v]) => {
    if (t.toLowerCase().includes("indica")) c.Indica += v;
    else if (t.toLowerCase().includes("sativa")) c.Sativa += v;
    else c.Hybrid += v;
  });
  return c;
}

export default function CategorySection({ selected }) {
  // Use wholesale data if available, otherwise calculate from retail
  const rawCategories =
    selected.wholesaleByCategory || selected.byCategory || {};
  const useWholesale = !!selected.wholesaleByCategory;

  const categories = Object.entries(rawCategories)
    .map(([name, value]) => [
      name,
      useWholesale ? value : Math.round(value * 0.45),
    ])
    .sort((a, b) => b[1] - a[1]);

  const rawTypes = selected.wholesaleByType || selected.byType || {};
  const types = Object.entries(consolidateTypes(rawTypes))
    .map(([name, value]) => [
      name,
      useWholesale ? value : Math.round(value * 0.45),
    ])
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const topCategory = categories[0];
  const topType = types[0];

  // Calculate total wholesale for percentages
  const totalWholesale = selected.wholesale || 0;

  const catColors = {
    Flower: "bg-green-500",
    "Pre-Roll": "bg-pink-500",
    Cartridges: "bg-amber-500",
    Concentrates: "bg-purple-500",
    "Infused Pre-Rolls": "bg-red-500",
  };

  const typeColors = {
    Indica: "bg-indigo-500",
    Hybrid: "bg-amber-500",
    Sativa: "bg-green-500",
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Selling</h2>
      <p className="text-gray-500 mb-6">Your biggest sellers at this store</p>

      {/* Categories */}
      <div className="mb-8">
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Wholesale by Category
        </div>
        <div className="flex gap-3 flex-wrap">
          {categories.map(([name, wholesale]) => {
            const isTop = name === topCategory?.[0];
            return (
              <div
                key={name}
                className={`px-5 py-3 rounded-2xl ${
                  isTop ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                <div className="font-semibold">{name}</div>
                <div className={isTop ? "text-gray-300" : "text-gray-500"}>
                  ${(wholesale / 1000).toFixed(1)}K
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Types */}
      <div>
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Wholesale by Type
        </div>
        <div className="flex gap-3">
          {types.map(([name, wholesale]) => {
            const pct = Math.round((wholesale / totalWholesale) * 100);
            return (
              <div key={name} className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{name}</span>
                  <span className="text-gray-500">{pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${typeColors[name] || "bg-gray-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
