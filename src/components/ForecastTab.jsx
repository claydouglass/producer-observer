import React, { useState, useMemo } from "react";
import {
  Store,
  Lock,
  Eye,
  FileText,
  Target,
  Plus,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Crown,
  Flame,
} from "lucide-react";
import KPICard from "./KPICard";
import ForecastChart from "./ForecastChart";

// Demo retailer network data
const retailerNetwork = [
  {
    id: 1,
    name: "Miracle Greens Bend",
    status: "connected",
    sharing: true,
    lastOrder: "2 days ago",
    estDemand: null,
  },
  {
    id: 2,
    name: "Green Planet PDX",
    status: "connected",
    sharing: true,
    lastOrder: "1 week ago",
    estDemand: null,
  },
  {
    id: 3,
    name: "Oregon's Finest",
    status: "connected",
    sharing: false,
    lastOrder: "3 days ago",
    estDemand: 8500,
  },
  {
    id: 4,
    name: "High Society Salem",
    status: "pending",
    sharing: false,
    lastOrder: null,
    estDemand: 12000,
  },
  {
    id: 5,
    name: "Cascade Cannabis",
    status: "not_connected",
    sharing: false,
    lastOrder: null,
    estDemand: 6500,
  },
];

// Demo retailer strategy data
const retailerStrategy = {
  purchaseOrders: [
    {
      date: "Dec 28",
      items: "Flower (Indica)",
      qty: "2 lbs",
      reason: "Holiday restock - high demand weekend",
    },
    {
      date: "Dec 22",
      items: "Pre-Rolls (Sativa)",
      qty: "200 units",
      reason: "Gift pack promotion",
    },
    {
      date: "Dec 15",
      items: "Cartridges (Hybrid)",
      qty: "50 units",
      reason: "Low inventory alert triggered",
    },
  ],
  priorities: [
    { category: "Flower", focus: "Indica for evening use", demand: "High" },
    {
      category: "Pre-Rolls",
      focus: "Value packs, party sizes",
      demand: "Medium",
    },
    { category: "Vape", focus: "Live resin, premium", demand: "Growing" },
  ],
  notes:
    "Miracle Greens focuses on local craft producers. They value consistency and pre-allocated inventory commitments.",
};

// Helper to consolidate types into 3 buckets
function consolidateTypes(byType) {
  const consolidated = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([type, value]) => {
    if (type.toLowerCase().includes("indica")) {
      consolidated.Indica += value;
    } else if (type.toLowerCase().includes("sativa")) {
      consolidated.Sativa += value;
    } else {
      consolidated.Hybrid += value; // 50/50, Hybrid, etc.
    }
  });
  return consolidated;
}

// Generate fake competitor rankings for demo
function generateRankings(selected, brands, category, strainType) {
  // Filter brands that have this category/type
  const relevantBrands = brands.filter((b) => {
    if (category !== "All") {
      if (!b.byCategory?.[category] || b.byCategory[category] === 0)
        return false;
    }
    if (strainType !== "All") {
      const consolidated = consolidateTypes(b.byType);
      if (!consolidated[strainType] || consolidated[strainType] === 0)
        return false;
    }
    return true;
  });

  // Calculate revenue for this segment
  const withSegmentRevenue = relevantBrands
    .map((b) => {
      let segmentRevenue = b.revenue;
      if (category !== "All") {
        segmentRevenue = b.byCategory?.[category] || 0;
      }
      if (strainType !== "All") {
        const typeRatio = consolidateTypes(b.byType)[strainType] / b.revenue;
        segmentRevenue = segmentRevenue * typeRatio;
      }
      return { ...b, segmentRevenue };
    })
    .sort((a, b) => b.segmentRevenue - a.segmentRevenue);

  // Find selected brand position
  const selectedIdx = withSegmentRevenue.findIndex((b) => b.id === selected.id);
  if (selectedIdx === -1) return null;

  return {
    rank: selectedIdx + 1,
    total: withSegmentRevenue.length,
    neighbors: {
      above: withSegmentRevenue.slice(
        Math.max(0, selectedIdx - 2),
        selectedIdx,
      ),
      selected: withSegmentRevenue[selectedIdx],
      below: withSegmentRevenue.slice(selectedIdx + 1, selectedIdx + 3),
    },
  };
}

export default function ForecastTab({
  chartData,
  selected,
  forecastTotal,
  historyPeak,
  historyTotal,
  forecastMin,
  forecastMax,
  brands = [],
}) {
  const [showRetailerNetwork, setShowRetailerNetwork] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  if (!selected) return null;

  const kpis = [
    {
      label: "Rank",
      value: `#${selected.rank}`,
      sub: "of 174 brands",
      delta: "+3",
    },
    {
      label: "Market Share",
      value: `${selected.marketShare}%`,
      sub: "of store revenue",
      delta: "+0.4%",
    },
    {
      label: "Customers",
      value: selected.customers.toString(),
      sub: "unique buyers",
      delta: "+8%",
    },
    {
      label: "Transactions",
      value: selected.transactions.toString(),
      sub: "total sales",
      delta: "+12%",
    },
  ];

  // Consolidate types to 3 buckets
  const consolidatedTypes = useMemo(
    () => consolidateTypes(selected.byType),
    [selected],
  );

  const typeColors = {
    Indica: "#6366f1",
    Hybrid: "#f59e0b",
    Sativa: "#10b981",
  };

  const typeData = Object.entries(consolidatedTypes)
    .filter(([_, revenue]) => revenue > 0)
    .map(([name, revenue]) => ({
      name,
      revenue,
      pct: Math.round((revenue / selected.revenue) * 100),
      color: typeColors[name],
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const catColors = {
    Flower: "#10b981",
    Cartridges: "#f59e0b",
    Concentrates: "#8b5cf6",
    "Pre-Roll": "#ec4899",
    "Edibles (Solid)": "#06b6d4",
    "Infused Pre-Rolls": "#f43f5e",
  };

  const categoryData = Object.entries(selected.byCategory || {})
    .map(([name, revenue]) => ({
      name,
      revenue,
      pct: Math.round((revenue / selected.revenue) * 100),
      color: catColors[name] || "#9ca3af",
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // Get ranking for current filter
  const ranking = useMemo(() => {
    if (!brands.length) return null;
    return generateRankings(selected, brands, selectedCategory, selectedType);
  }, [selected, brands, selectedCategory, selectedType]);

  const categories = ["All", ...Object.keys(selected.byCategory || {})];
  const types = ["All", "Indica", "Hybrid", "Sativa"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      <ForecastChart
        chartData={chartData}
        historyPeak={historyPeak}
        historyTotal={historyTotal}
        forecastMin={forecastMin}
        forecastMax={forecastMax}
        selected={selected}
      />

      {/* KILLER FEATURE: Competitive Ranking by Segment */}
      <div className="p-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-900">
              Your Ranking
            </span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded ml-2">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {ranking && (
          <div className="space-y-1">
            {/* Brands above */}
            {ranking.neighbors.above.map((brand, i) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                    {ranking.rank - (ranking.neighbors.above.length - i)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">
                      {brand.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedCategory !== "All"
                        ? selectedCategory
                        : "All Categories"}
                      {selectedType !== "All" ? ` · ${selectedType}` : ""}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-700">
                    ${Math.round(brand.segmentRevenue).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} />+
                    {Math.floor(Math.random() * 15 + 3)}%
                  </div>
                </div>
              </div>
            ))}

            {/* SELECTED BRAND - HIGHLIGHTED */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg transform scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-blue-600">
                  {ranking.rank}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {selected.name}
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                      YOU
                    </span>
                  </div>
                  <div className="text-xs text-blue-100">
                    #{ranking.rank} of {ranking.total} in{" "}
                    {selectedCategory !== "All"
                      ? selectedCategory
                      : "All Categories"}
                    {selectedType !== "All" ? ` · ${selectedType}` : ""}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-xl">
                  $
                  {Math.round(
                    ranking.neighbors.selected.segmentRevenue,
                  ).toLocaleString()}
                </div>
                <div className="text-xs text-blue-100">this period</div>
              </div>
            </div>

            {/* Brands below - THE ONES CATCHING UP */}
            {ranking.neighbors.below.map((brand, i) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm font-bold text-red-600">
                    {ranking.rank + i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">
                      {brand.name}
                    </div>
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <TrendingUp size={10} />
                      Gaining on you
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-700">
                    ${Math.round(brand.segmentRevenue).toLocaleString()}
                  </div>
                  <div className="text-xs text-red-600">
                    $
                    {Math.round(
                      ranking.neighbors.selected.segmentRevenue -
                        brand.segmentRevenue,
                    ).toLocaleString()}{" "}
                    behind
                  </div>
                </div>
              </div>
            ))}

            {ranking.neighbors.below.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                  <Flame size={14} />
                  {ranking.neighbors.below[0]?.name} is $
                  {Math.round(
                    ranking.neighbors.selected.segmentRevenue -
                      ranking.neighbors.below[0]?.segmentRevenue,
                  ).toLocaleString()}{" "}
                  behind you
                </div>
                <div className="text-xs text-red-600 mt-1">
                  At their growth rate, they could overtake you in ~6 weeks
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pro upsell for non-sharing retailers */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-blue-700">
              <Lock size={12} className="inline mr-1" />
              Rankings update in real-time when retailer shares data
            </div>
            <button className="text-xs text-blue-700 font-medium hover:text-blue-800 flex items-center gap-1">
              See all {ranking?.total} brands <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Retailer Strategy Section */}
      <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              Retailer Strategy & PO Insights
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Why they order what they order
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Recent Orders
            </div>
            <div className="space-y-2">
              {retailerStrategy.purchaseOrders.map((po, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {po.items}
                    </span>
                    <span className="text-xs text-gray-400">{po.date}</span>
                  </div>
                  <div className="text-xs text-gray-500">{po.qty}</div>
                  <div className="text-xs text-blue-600 mt-1">{po.reason}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Category Priorities
            </div>
            <div className="space-y-2">
              {retailerStrategy.priorities.map((p, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {p.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        p.demand === "High"
                          ? "bg-green-100 text-green-700"
                          : p.demand === "Growing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.demand}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{p.focus}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-xs text-amber-800">
                {retailerStrategy.notes}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retailer Network - Pro Feature */}
      <div className="border border-dashed border-blue-300 rounded-xl overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setShowRetailerNetwork(!showRetailerNetwork)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Store size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                Retailer Network
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Add retailers, estimate demand, see rankings everywhere
              </div>
            </div>
          </div>
          <div className="text-sm text-blue-600 font-medium">
            {showRetailerNetwork ? "Hide" : "Preview"}
          </div>
        </div>

        {showRetailerNetwork && (
          <div className="p-6 bg-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Get rankings at every retailer. More data = better forecasts.
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus size={14} /> Add Retailer
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
              {retailerNetwork.map((retailer) => (
                <div
                  key={retailer.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        retailer.sharing
                          ? "bg-green-100"
                          : retailer.status === "connected"
                            ? "bg-amber-100"
                            : "bg-gray-100"
                      }`}
                    >
                      <Store
                        size={14}
                        className={
                          retailer.sharing
                            ? "text-green-600"
                            : retailer.status === "connected"
                              ? "text-amber-600"
                              : "text-gray-400"
                        }
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {retailer.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {retailer.sharing ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Eye size={10} /> Live rankings
                          </span>
                        ) : retailer.status === "connected" ? (
                          <span className="text-amber-600">
                            <Lock size={10} className="inline" /> Request
                            sharing to see rankings
                          </span>
                        ) : (
                          <span className="text-gray-400">Not connected</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {retailer.sharing ? (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          #12 of 89
                        </div>
                        <div className="text-xs text-gray-400">Your rank</div>
                      </div>
                    ) : retailer.estDemand ? (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          ${retailer.estDemand.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Your estimate
                        </div>
                      </div>
                    ) : null}
                    {!retailer.sharing && retailer.status === "connected" && (
                      <button className="text-xs px-2 py-1 border border-blue-200 text-blue-600 rounded hover:bg-blue-50">
                        Request
                      </button>
                    )}
                    {retailer.status === "not_connected" && (
                      <button className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Invite
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Type Breakdown */}
      {typeData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            By strain type
          </div>
          <div className="grid grid-cols-3 gap-4">
            {typeData.map((type) => (
              <div
                key={type.name}
                className="p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {type.name}
                  </span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  ${type.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  {type.pct}% of sales
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categoryData.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-900 mb-3">
            By category
          </div>
          <div className="grid grid-cols-4 gap-4">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className="p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${cat.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{cat.pct}% of sales</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
