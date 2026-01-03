import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Download, ArrowUpDown } from "lucide-react";
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
  const [sortField, setSortField] = useState("wholesale");
  const [sortDir, setSortDir] = useState("desc");

  const allProducts = selected.products || [];
  if (!allProducts.length) return null;

  // Get exact product data for timeframe
  const scaledProducts = useMemo(
    () => getProductsByDateRange(allProducts, timeframe),
    [allProducts, timeframe],
  );

  const categories = ["All", ...new Set(scaledProducts.map((p) => p.category))];
  const filteredProducts =
    filter === "All"
      ? scaledProducts
      : scaledProducts.filter((p) => p.category === filter);

  // Sort products
  const products = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "name":
          aVal = a.name.split("|")[0].trim().toLowerCase();
          bVal = b.name.split("|")[0].trim().toLowerCase();
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "category":
          aVal = a.category || "";
          bVal = b.category || "";
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "type":
          aVal = consolidateSpecies(a.species) || "";
          bVal = consolidateSpecies(b.species) || "";
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "units":
          aVal = a.units || 0;
          bVal = b.units || 0;
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        case "wholesale":
        default:
          aVal = a.wholesale || 0;
          bVal = b.wholesale || 0;
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
    });
    return sorted;
  }, [filteredProducts, sortField, sortDir]);

  const totalRevenue = products.reduce((sum, p) => sum + p.wholesale, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.units, 0);

  // Format header units based on selected filter
  const headerUnits = formatUnits(totalUnits, filter === "All" ? null : filter);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // Download CSV
  const downloadCSV = () => {
    const headers = [
      "Rank",
      "Product",
      "Category",
      "Type",
      "Qty",
      "Unit",
      "Revenue",
    ];
    const rows = products.map((p, i) => {
      const unitInfo = formatUnits(p.units, p.category);
      return [
        i + 1,
        `"${p.name.split("|")[0].trim()}"`,
        p.category,
        consolidateSpecies(p.species) || "",
        unitInfo.value,
        unitInfo.label,
        p.wholesale.toFixed(2),
      ];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.name.replace(/\s+/g, "_")}_products_${timeframe}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sort indicator
  const SortHeader = ({ field, children, align = "left" }) => {
    const alignClass =
      align === "right"
        ? "text-right"
        : align === "center"
          ? "text-center"
          : "text-left";
    const justifyClass =
      align === "right"
        ? "justify-end"
        : align === "center"
          ? "justify-center"
          : "justify-start";
    return (
      <th
        className={`${alignClass} px-3 py-2 text-gray-500 font-medium cursor-pointer hover:text-gray-700 select-none`}
        onClick={() => handleSort(field)}
      >
        <span className={`inline-flex items-center gap-1 ${justifyClass}`}>
          {children}
          {sortField === field && (
            <span className="text-blue-500">
              {sortDir === "asc" ? "↑" : "↓"}
            </span>
          )}
        </span>
      </th>
    );
  };

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
              <div className="flex items-center gap-6">
                <div className="text-right min-w-[80px]">
                  <span className="font-semibold text-gray-900">
                    {unitInfo.value}
                  </span>
                  <span className="text-gray-500 ml-1">{unitInfo.label}</span>
                </div>
                <div className="text-right min-w-[90px]">
                  <span className="font-medium text-gray-900">
                    ${p.wholesale.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand toggle and download */}
      {products.length > 5 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            {expanded ? "Hide" : `View all ${products.length}`}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expanded && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
              title="Download CSV"
            >
              <Download size={14} />
              CSV
            </button>
          )}
        </div>
      )}

      {expanded && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 text-gray-500 font-medium w-12">
                  #
                </th>
                <SortHeader field="name">Product</SortHeader>
                <SortHeader field="category">Category</SortHeader>
                <SortHeader field="type">Type</SortHeader>
                <SortHeader field="units" align="center">
                  {filter === "All" ? "Qty" : getCategoryUnitLabel(filter)}
                </SortHeader>
                <SortHeader field="wholesale" align="right">
                  Revenue
                </SortHeader>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const unitInfo = formatUnits(p.units, p.category);
                const type = consolidateSpecies(p.species);
                return (
                  <tr
                    key={p.name}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-gray-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {p.name.split("|")[0].trim()}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{p.category}</td>
                    <td className="px-3 py-2">
                      {type && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            type === "Indica"
                              ? "bg-purple-100 text-purple-700"
                              : type === "Sativa"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {type}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-semibold text-gray-900 text-right">
                          {unitInfo.value}
                        </span>
                        <span className="text-gray-400 w-12 text-left">
                          {unitInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-green-600 font-medium">
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
