import React from "react";
import { Target, Zap } from "lucide-react";
import { SectionHeader, InsightCard } from "./ReportComponents";

const marketGaps = [
  { name: "Gummies", market: 47331, priority: "critical" },
  { name: "510 Thread Live Resin", market: 47304, priority: "critical" },
  { name: "1oz Flower Deal", market: 13910, priority: "high" },
  { name: "Pre-Roll Multi-Packs", market: 26519, priority: "high" },
  { name: "Dab - Live Resin", market: 4980, priority: "medium" },
];

export default function GapsSection({ selected }) {
  const totalOpportunity = marketGaps.reduce((sum, g) => sum + g.market, 0);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
      <SectionHeader
        icon={Target}
        title="Market Gaps"
        subtitle="Your RFP: Categories where we have demand but you have no presence"
      />

      <div className="space-y-3">
        {marketGaps.map((gap) => (
          <div key={gap.name} className="bg-white rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${
                  gap.priority === "critical" ? "bg-red-500" :
                  gap.priority === "high" ? "bg-amber-500" : "bg-gray-300"
                }`} />
                <div>
                  <div className="font-semibold text-gray-900">{gap.name}</div>
                  <div className="text-sm text-gray-500">
                    <span className={`font-medium ${
                      gap.priority === "critical" ? "text-red-600" :
                      gap.priority === "high" ? "text-amber-600" : "text-gray-600"
                    }`}>
                      {gap.priority.toUpperCase()}
                    </span>
                    {" · "}Your presence: $0
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">${(gap.market / 1000).toFixed(0)}K</div>
                <div className="text-xs text-gray-500">market size</div>
                <div className="text-sm text-purple-600 font-medium mt-1">
                  5% = ${(gap.market * 0.05 / 1000).toFixed(1)}K
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InsightCard type="opportunity" icon={Zap} title="Total Opportunity">
        If {selected.name} captures just 5% in each gap: <strong>${(totalOpportunity * 0.05 / 1000).toFixed(0)}K+ additional revenue</strong>
      </InsightCard>
    </div>
  );
}
