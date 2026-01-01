import React from "react";
import { Zap, Target, BarChart3 } from "lucide-react";
import { gapData, totalOpportunity, criticalGapsCount } from "../data/gapData";
import { ProFeatureCard } from "./ProUpgradePrompt";

export default function GapsTab({ selected }) {
  const captureAmount = Math.round(totalOpportunity * 0.05);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Market Gap Analysis
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Categories with customer demand where {selected?.name || "you"} have
          no presence.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
          <div className="text-sm text-blue-600 mb-1">Total opportunity</div>
          <div className="text-2xl font-semibold text-blue-900">
            ${Math.round(totalOpportunity / 1000)}K
          </div>
        </div>
        <div className="p-5 rounded-xl bg-green-50 border border-green-100">
          <div className="text-sm text-green-600 mb-1">5% capture</div>
          <div className="text-2xl font-semibold text-green-900">
            +${(captureAmount / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="p-5 rounded-xl bg-red-50 border border-red-100">
          <div className="text-sm text-red-600 mb-1">Critical gaps</div>
          <div className="text-2xl font-semibold text-red-900">
            {criticalGapsCount}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
        {gapData.map((gap, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-1.5 h-8 rounded-full ${
                  gap.priority === "critical"
                    ? "bg-red-500"
                    : gap.priority === "high"
                      ? "bg-amber-500"
                      : "bg-gray-300"
                }`}
              />
              <div>
                <div className="font-medium text-gray-900">{gap.name}</div>
                <div className="text-sm text-gray-500">
                  {selected?.name || "Your"} presence: $0
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                ${(gap.market / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-gray-400">market size</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Features Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            Unlock with Pro
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ProFeatureCard
            icon={Target}
            feature="Gap-Fill Planning"
            description="Get recommendations on which gaps to fill first based on your production capacity."
          />
          <ProFeatureCard
            icon={BarChart3}
            feature="Competitive Analysis"
            description="See which competitors fill these gaps and their market share."
          />
        </div>
      </div>
    </div>
  );
}
