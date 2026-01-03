import React from "react";
import { Sparkles } from "lucide-react";

const opportunities = [
  {
    name: "Gummies",
    size: 21,
    reason: "Your customers buy these from other brands",
  },
  { name: "510 Cartridges", size: 21, reason: "Highest-volume cart segment" },
  { name: "Pre-Roll Packs", size: 12, reason: "Only 1 competitor here" },
  { name: "1oz Flower Deal", size: 6, reason: "Your flower quality would win" },
];

export default function GapsSection({ selected }) {
  const totalOpp = opportunities.reduce((s, o) => s + o.size, 0);

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-violet-500" size={18} />
          <span className="text-sm font-medium text-gray-900">
            Opportunities
          </span>
        </div>
        <span className="text-lg font-semibold text-violet-600">
          ${totalOpp}K potential
        </span>
      </div>

      <div className="space-y-2">
        {opportunities.map((opp) => (
          <div
            key={opp.name}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div>
              <div className="font-medium text-gray-900">{opp.name}</div>
              <div className="text-xs text-gray-500">{opp.reason}</div>
            </div>
            <div className="font-semibold text-violet-600">${opp.size}K</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Even 5% capture ={" "}
        <strong className="text-gray-900">
          ${Math.round(totalOpp * 0.05)}K+
        </strong>
      </div>
    </div>
  );
}
