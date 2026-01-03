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

  const totalWholesale = selected.wholesale || 0;

  const catColors = {
    Flower: "#10b981",
    "Pre-Roll": "#ec4899",
    Cartridges: "#f59e0b",
    Concentrates: "#8b5cf6",
    "Infused Pre-Rolls": "#f43f5e",
    "Edibles (Solid)": "#06b6d4",
  };

  const typeColors = {
    Indica: "#6366f1",
    Hybrid: "#f59e0b",
    Sativa: "#10b981",
  };

  return (
    <div className="space-y-6">
      {/* Revenue by Category */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">
          Revenue by Category
        </div>
        <div className="grid grid-cols-4 gap-4">
          {categories.map(([name, wholesale]) => {
            const pct = Math.round((wholesale / totalWholesale) * 100);
            return (
              <div key={name} className="p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: catColors[name] || "#9ca3af" }}
                  />
                  <span className="text-sm text-gray-600">{name}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${(wholesale / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-gray-400">{pct}% of revenue</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Type */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">
          Revenue by Type
        </div>
        <div className="grid grid-cols-3 gap-4">
          {types.map(([name, wholesale]) => {
            const pct = Math.round((wholesale / totalWholesale) * 100);
            return (
              <div key={name} className="p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: typeColors[name] || "#9ca3af" }}
                  />
                  <span className="font-medium text-gray-700">{name}</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  ${(wholesale / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-gray-400">{pct}% of revenue</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
