import React from "react";
import { ShoppingCart, X } from "lucide-react";
import ExpandableSection from "./ExpandableSection";

// Mock basket data - would come from API
function getBasketData() {
  const companionBrands = [
    { brand: "Brand A", baskets: 49, revenue: 902, category: "Flower" },
    { brand: "Brand B", baskets: 47, revenue: 1363, category: "Flower" },
    { brand: "Brand C", baskets: 28, revenue: 1038, category: "Flower" },
    { brand: "Brand D", baskets: 19, revenue: 518, category: "Flower" },
    { brand: "Brand E", baskets: 16, revenue: 172, category: "Gummies" },
  ];

  const companionCategories = [
    { category: "Flower", baskets: 171, revenue: 5930 },
    { category: "Cartridges", baskets: 57, revenue: 1743 },
    { category: "Concentrates", baskets: 53, revenue: 1575 },
    { category: "Edibles (Solid)", baskets: 52, revenue: 990 },
    { category: "Pre-Roll", baskets: 45, revenue: 592 },
    { category: "Infused Pre-Rolls", baskets: 33, revenue: 643 },
  ];

  const crossSellGaps = [
    { category: "Gummies", baskets: 52, youOffer: false },
    { category: "510 Thread LR", baskets: 40, youOffer: false },
    { category: "Pre-Roll Multi-Pack", baskets: 45, youOffer: false },
    { category: "Dab Live Resin", baskets: 30, youOffer: false },
  ];

  return { companionBrands, companionCategories, crossSellGaps };
}

export default function BasketSection({ selected }) {
  const { companionBrands, companionCategories, crossSellGaps } = getBasketData();
  const totalGapBaskets = crossSellGaps.reduce((s, g) => s + g.baskets, 0);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Basket Affinity</h2>
          <p className="text-gray-500">What customers buy alongside your products</p>
        </div>
      </div>

      {/* Cross-sell gaps - the hot take */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 mb-6">
        <div className="font-semibold text-gray-900 mb-2">
          Your customers buy these from OTHER brands
        </div>
        <div className="flex flex-wrap gap-2">
          {crossSellGaps.map((g) => (
            <div
              key={g.category}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-red-200"
            >
              <X size={14} className="text-red-500" />
              <span className="font-medium">{g.category}</span>
              <span className="text-sm text-gray-500">{g.baskets} baskets</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {totalGapBaskets} purchase opportunities going to competitors
        </div>
      </div>

      {/* Expandable details */}
      <div className="space-y-3">
        <ExpandableSection
          title="Categories in Your Baskets"
          summary="Flower & Cartridges top companions"
          downloadData={companionCategories}
          downloadFilename="basket-categories.csv"
        >
          <div className="space-y-2">
            {companionCategories.map((c, i) => (
              <div key={c.category} className="flex items-center gap-4">
                <div className="w-8 text-sm text-gray-400">#{i + 1}</div>
                <div className="w-40 font-medium">{c.category}</div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(c.baskets / companionCategories[0].baskets) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm">{c.baskets} baskets</div>
                <div className="w-20 text-right text-sm text-gray-500">${c.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        <ExpandableSection
          title="Brands Bought Together"
          summary="See who shares your customers"
          downloadData={companionBrands}
          downloadFilename="companion-brands.csv"
        >
          <div className="grid grid-cols-2 gap-3">
            {companionBrands.map((b) => (
              <div key={b.brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{b.brand}</div>
                  <div className="text-sm text-gray-500">{b.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{b.baskets} shared</div>
                  <div className="text-sm text-gray-500">${b.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            These brands appear frequently in baskets with yours. Consider complementary positioning.
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
}
