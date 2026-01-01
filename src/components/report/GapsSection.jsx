import React from "react";
import { Sparkles } from "lucide-react";

const opportunities = [
  {
    name: "Gummies",
    size: 47,
    reason: "Your customers already buy these from other brands",
  },
  {
    name: "510 Cartridges",
    size: 47,
    reason: "Our highest-volume cart segment",
  },
  {
    name: "Pre-Roll Packs",
    size: 27,
    reason: "Only 1 competitor here right now",
  },
  {
    name: "1oz Flower Deal",
    size: 14,
    reason: "Your flower quality would win here",
  },
];

export default function GapsSection({ selected }) {
  const totalOpp = opportunities.reduce((s, o) => s + o.size, 0);

  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-8 border border-violet-100">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-violet-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            ${totalOpp}K in opportunities
          </h2>
          <p className="text-gray-600">
            Products your customers want that you don't have yet
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {opportunities.map((opp) => (
          <div
            key={opp.name}
            className="bg-white rounded-2xl p-5 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-gray-900 text-lg">
                {opp.name}
              </div>
              <div className="text-gray-500">{opp.reason}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-600">
                ${opp.size}K
              </div>
              <div className="text-sm text-gray-400">market size</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="text-gray-500 mb-3">
          Even capturing 5% of these ={" "}
          <strong className="text-gray-900">
            ${Math.round(totalOpp * 0.05)}K+ extra revenue
          </strong>
        </div>
      </div>
    </div>
  );
}
