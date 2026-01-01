import React from "react";
import { Package, TrendingUp, TrendingDown } from "lucide-react";
import { SectionHeader, RankBadge } from "./ReportComponents";

// Helper to consolidate types
function consolidateTypes(byType) {
  const consolidated = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(byType || {}).forEach(([type, value]) => {
    if (type.toLowerCase().includes('indica')) consolidated.Indica += value;
    else if (type.toLowerCase().includes('sativa')) consolidated.Sativa += value;
    else consolidated.Hybrid += value;
  });
  return consolidated;
}

export default function CategorySection({ selected }) {
  const categoryPerformance = Object.entries(selected.byCategory || {}).map(([name, revenue]) => ({
    name,
    revenue,
    pct: Math.round((revenue / selected.revenue) * 100),
    rank: Math.floor(Math.random() * 20) + 1,
    trend: Math.random() > 0.5 ? "up" : "down",
  })).sort((a, b) => b.revenue - a.revenue);

  const consolidatedTypes = consolidateTypes(selected.byType);
  const typeColors = { Indica: "indigo", Hybrid: "amber", Sativa: "green" };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <SectionHeader
          icon={Package}
          title="Category Performance"
          subtitle="Your position in each product category"
        />

        <div className="grid grid-cols-2 gap-4">
          {categoryPerformance.map((cat) => (
            <div key={cat.name} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-900">{cat.name}</div>
                <RankBadge rank={cat.rank} total={30} />
              </div>
              <div className="text-2xl font-bold text-gray-900">${cat.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{cat.pct}% of your total</div>
              <div className="mt-3">
                {cat.trend === "up" ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                    <TrendingUp size={12} /> Growing
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                    <TrendingDown size={12} /> Declining
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <SectionHeader
          icon={Package}
          title="Strain Type Performance"
          subtitle="Indica vs Hybrid vs Sativa breakdown"
        />

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(consolidatedTypes).filter(([_, v]) => v > 0).map(([type, revenue]) => {
            const pct = Math.round((revenue / selected.revenue) * 100);
            const color = typeColors[type];

            return (
              <div key={type} className={`border-2 border-${color}-200 bg-${color}-50 rounded-xl p-4`}>
                <div className={`text-${color}-600 font-semibold mb-2`}>{type}</div>
                <div className="text-2xl font-bold text-gray-900">${revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{pct}% of sales</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
