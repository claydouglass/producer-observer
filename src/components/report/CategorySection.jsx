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
  const categories = Object.entries(selected.byCategory || {}).sort(
    (a, b) => b[1] - a[1],
  );

  const types = Object.entries(consolidateTypes(selected.byType))
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const topCategory = categories[0];
  const topType = types[0];

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
          By Category
        </div>
        <div className="flex gap-3 flex-wrap">
          {categories.map(([name, revenue]) => {
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
                  ${(revenue / 1000).toFixed(1)}K
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Types */}
      <div>
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          By Type
        </div>
        <div className="flex gap-3">
          {types.map(([name, revenue]) => {
            const pct = Math.round((revenue / selected.revenue) * 100);
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
