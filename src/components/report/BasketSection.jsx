import React, { useState } from "react";
import { ShoppingCart, ChevronDown, ChevronUp, X } from "lucide-react";

function getBasketData() {
  const companionBrands = [
    { brand: "Brand A", baskets: 49, wholesale: 406, category: "Flower" },
    { brand: "Brand B", baskets: 47, wholesale: 613, category: "Flower" },
    { brand: "Brand C", baskets: 28, wholesale: 467, category: "Flower" },
    { brand: "Brand D", baskets: 19, wholesale: 233, category: "Flower" },
    { brand: "Brand E", baskets: 16, wholesale: 77, category: "Gummies" },
  ];

  const companionCategories = [
    { category: "Flower", baskets: 171, wholesale: 2669 },
    { category: "Cartridges", baskets: 57, wholesale: 784 },
    { category: "Concentrates", baskets: 53, wholesale: 709 },
    { category: "Edibles (Solid)", baskets: 52, wholesale: 446 },
    { category: "Pre-Roll", baskets: 45, wholesale: 266 },
  ];

  const crossSellGaps = [
    { category: "Gummies", baskets: 52 },
    { category: "510 Thread LR", baskets: 40 },
    { category: "Pre-Roll Multi-Pack", baskets: 45 },
  ];

  return { companionBrands, companionCategories, crossSellGaps };
}

export default function BasketSection({ selected }) {
  const [expanded, setExpanded] = useState(false);
  const { companionBrands, companionCategories, crossSellGaps } =
    getBasketData();
  const totalGapBaskets = crossSellGaps.reduce((s, g) => s + g.baskets, 0);

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-blue-500" size={18} />
          <span className="text-sm font-medium text-gray-900">
            Basket Affinity
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {expanded ? "Hide" : "Show"} details
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Quick insight - always visible */}
      <div className="p-3 bg-red-50 rounded-lg mb-4">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Customers buy these from competitors
        </div>
        <div className="flex flex-wrap gap-2">
          {crossSellGaps.map((g) => (
            <span
              key={g.category}
              className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-red-200"
            >
              <X size={10} className="text-red-500" />
              {g.category}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {totalGapBaskets} baskets going elsewhere
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Categories */}
          <div>
            <div className="text-xs text-gray-500 mb-2">
              Top companion categories
            </div>
            <div className="space-y-1">
              {companionCategories.slice(0, 5).map((c) => (
                <div
                  key={c.category}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{c.category}</span>
                  <span className="text-gray-500">{c.baskets} baskets</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <div className="text-xs text-gray-500 mb-2">
              Brands bought together
            </div>
            <div className="space-y-1">
              {companionBrands.slice(0, 5).map((b) => (
                <div
                  key={b.brand}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{b.brand}</span>
                  <span className="text-gray-500">{b.baskets} shared</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
