import React from "react";
import { Zap } from "lucide-react";
import { SectionHeader } from "./ReportComponents";

const immediateActions = [
  { title: "Investigate Flower Decline", desc: "Dropped from #2 to #8. Was this supply?" },
  { title: "Double Down on Concentrates", desc: "You're #3 and growing. Increase allocation." },
  { title: "Address Low-Velocity SKUs", desc: "5 products need discontinuation review." },
];

const mediumTermActions = [
  { title: "Launch Gummies Line", desc: "$47K market, 0% presence. Natural extension." },
  { title: "Launch 510 Thread LR", desc: "Your AIOs perform. Extend to 510 format." },
  { title: "Create 1oz Flower Deal", desc: "Only 1 competitor. Your quality wins here." },
];

export default function PartnershipSection({ selected }) {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <SectionHeader
          icon={Zap}
          title="Partnership Opportunities"
          subtitle="Specific actions to drive mutual growth"
        />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Immediate (30 Days)
            </div>
            <div className="space-y-3">
              {immediateActions.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Medium-Term (60-90 Days)
            </div>
            <div className="space-y-3">
              {mediumTermActions.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projection Summary */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-green-200 text-sm font-medium mb-2">THE OPPORTUNITY</div>
          <h3 className="text-2xl font-bold mb-4">
            If {selected.name} addresses the gaps in this report:
          </h3>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-green-200 text-xs">Current Revenue</div>
              <div className="text-2xl font-bold">${selected.revenue.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-green-200 text-xs">Potential Revenue</div>
              <div className="text-2xl font-bold">${Math.round(selected.revenue * 1.84).toLocaleString()}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-green-200 text-xs">Projected Uplift</div>
              <div className="text-2xl font-bold">+84%</div>
            </div>
          </div>

          <p className="text-green-100 mb-6">
            We believe {selected.name} can be a <strong>Top 5 brand</strong> at Miracle Greens Bend.
          </p>

          <button className="px-8 py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition-colors">
            Schedule Partnership Review
          </button>
        </div>
      </div>
    </>
  );
}
