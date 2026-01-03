import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  getProductsByDateRange,
  formatUnits,
  getCategoryUnitLabel,
} from "../../utils/rankings";

// Consolidate species to 3 types
function consolidateSpecies(species) {
  if (!species) return null;
  const s = species.toLowerCase();
  if (s.includes("indica")) return "Indica";
  if (s.includes("sativa")) return "Sativa";
  if (s.includes("hybrid") || s.includes("50/50") || s.includes("50-50"))
    return "Hybrid";
  return species;
}

export default function ProductSection({ selected, timeframe = "all" }) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState("All");

  const allProducts = selected.products || [];
  if (!allProducts.length) return null;

  // Get exact product data for timeframe
  const scaledProducts = useMemo(
    () => getProductsByDateRange(allProducts, timeframe),
    [allProducts, timeframe],
  );

  const categories = ["All", ...new Set(scaledProducts.map((p) => p.category))];
  const products =
    filter === "All"
      ? scaledProducts
      : scaledProducts.filter((p) => p.category === filter);
  const totalRevenue = products.reduce((sum, p) => sum + p.wholesale, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.units, 0);

  // Format header units based on selected filter
  const headerUnits = formatUnits(totalUnits, filter === "All" ? null : filter);

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-900">Products</div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-gray-900">
            {headerUnits.value} {headerUnits.label}
          </span>
          <span className="text-green-600">
            ${totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Top products */}
      <div className="space-y-2 mb-4">
        {products.slice(0, 5).map((p, i) => {
          const unitInfo = formatUnits(p.units, p.category);
          return (
            <div
              key={p.name}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-5">
                  #{i + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {p.name.split("|")[0].trim()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.category}
                    {p.species ? `, ${consolidateSpecies(p.species)}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {unitInfo.value}
                  </div>
                  <div className="text-xs text-gray-400">{unitInfo.label}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${p.wholesale.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand toggle */}
      {products.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          {expanded ? "Hide" : `View all ${products.length}`}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}

      {expanded && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  Product
                </th>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  Category
                </th>
                <th className="text-right px-3 py-2 text-gray-500 font-medium">
                  {filter === "All" ? "Qty" : getCategoryUnitLabel(filter)}
                </th>
                <th className="text-right px-3 py-2 text-gray-500 font-medium">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const unitInfo = formatUnits(p.units, p.category);
                return (
                  <tr key={p.name} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {p.name.split("|")[0].trim()}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{p.category}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">
                      {unitInfo.value}{" "}
                      <span className="text-gray-400 font-normal">
                        {unitInfo.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-green-600">
                      ${p.wholesale.toLocaleString()}
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
