import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const TrendIcon = ({ trend }) => {
  if (trend === "up")
    return <TrendingUp size={14} className="text-green-500" />;
  if (trend === "down")
    return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
};

export default function ProductSection({ selected }) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState("All");

  const allProducts = selected.products || [];
  if (!allProducts.length) return null;

  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];
  const products =
    filter === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === filter);
  const totalWholesale = products.reduce((sum, p) => sum + p.wholesale, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.units, 0);

  // Units by category (what producers care about)
  const unitsByCategory = allProducts.reduce(
    (acc, p) => ({
      ...acc,
      [p.category]: {
        units: (acc[p.category]?.units || 0) + p.units,
        wholesale: (acc[p.category]?.wholesale || 0) + p.wholesale,
      },
    }),
    {},
  );

  // Units by species/type
  const unitsBySpecies = allProducts.reduce((acc, p) => {
    const s = p.species || "Unknown";
    return {
      ...acc,
      [s]: {
        units: (acc[s]?.units || 0) + p.units,
        wholesale: (acc[s]?.wholesale || 0) + p.wholesale,
      },
    };
  }, {});

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      {/* Header - Units first, then wholesale */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Performance
          </h2>
          <p className="text-gray-500">What you sold at this store</p>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {totalUnits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">units sold</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${totalWholesale.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">wholesale</div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              filter === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Top 5 cards - Units prominent */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {products.slice(0, 5).map((p, i) => (
          <div
            key={p.name}
            className={`rounded-xl p-4 border ${
              p.trend === "up"
                ? "bg-green-50 border-green-100"
                : p.trend === "down"
                  ? "bg-red-50 border-red-100"
                  : "bg-gray-50 border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400">
                #{i + 1}
              </span>
              <TrendIcon trend={p.trend} />
            </div>
            <div
              className="font-medium text-gray-900 text-sm truncate mb-2"
              title={p.name}
            >
              {p.name.split("|")[0].trim()}
            </div>
            <div className="text-2xl font-bold text-gray-900">{p.units}</div>
            <div className="text-xs text-gray-500">units</div>
            <div className="text-sm font-medium text-green-600 mt-1">
              ${p.wholesale.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Expand toggle */}
      {products.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-4"
        >
          {expanded ? "Hide" : `View all ${products.length} products`}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {expanded && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">
                  Product
                </th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">
                  Category
                </th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-right px-4 py-2 text-gray-500 font-medium">
                  Units
                </th>
                <th className="text-right px-4 py-2 text-gray-500 font-medium">
                  Wholesale
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.name} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{p.category}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {p.species || "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-gray-900">
                    {p.units}
                  </td>
                  <td className="px-4 py-2 text-right text-green-600">
                    ${p.wholesale.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Category + Type breakdown - Units first */}
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-3">
            By Category
          </div>
          {Object.entries(unitsByCategory)
            .sort((a, b) => b[1].units - a[1].units)
            .map(([cat, data]) => (
              <div key={cat} className="flex justify-between py-1">
                <span className="text-sm text-gray-700">{cat}</span>
                <span className="text-sm">
                  <span className="font-bold text-gray-900">{data.units}</span>
                  <span className="text-gray-400 mx-1">·</span>
                  <span className="text-green-600">
                    ${data.wholesale.toLocaleString()}
                  </span>
                </span>
              </div>
            ))}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-3">By Type</div>
          {Object.entries(unitsBySpecies)
            .sort((a, b) => b[1].units - a[1].units)
            .map(([s, data]) => (
              <div key={s} className="flex justify-between py-1">
                <span className="text-sm text-gray-700">{s}</span>
                <span className="text-sm">
                  <span className="font-bold text-gray-900">{data.units}</span>
                  <span className="text-gray-400 mx-1">·</span>
                  <span className="text-green-600">
                    ${data.wholesale.toLocaleString()}
                  </span>
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
