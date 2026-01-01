import React, { useState } from "react";
import {
  Zap,
  Target,
  BarChart3,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { gapData, totalOpportunity, criticalGapsCount } from "../data/gapData";
import { ProFeatureCard } from "./ProUpgradePrompt";

// Demo competitor data - illustrative performance metrics
const competitorData = [
  {
    name: "Top Shelf Co",
    revenue: 245000,
    trend: "up",
    trendPct: 12,
    categories: ["Flower", "Pre-Rolls"],
    marketShare: 18.2,
  },
  {
    name: "Green Valley Farms",
    revenue: 198000,
    trend: "up",
    trendPct: 8,
    categories: ["Flower", "Vape"],
    marketShare: 14.7,
  },
  {
    name: "Pacific Craft",
    revenue: 156000,
    trend: "flat",
    trendPct: 0,
    categories: ["Flower", "Edibles"],
    marketShare: 11.6,
  },
  {
    name: "Mountain High",
    revenue: 134000,
    trend: "down",
    trendPct: -5,
    categories: ["Pre-Rolls", "Vape"],
    marketShare: 9.9,
  },
  {
    name: "Cascade Premium",
    revenue: 112000,
    trend: "up",
    trendPct: 22,
    categories: ["Flower"],
    marketShare: 8.3,
  },
];

const TrendIcon = ({ trend }) => {
  if (trend === "up")
    return <TrendingUp size={14} className="text-green-500" />;
  if (trend === "down")
    return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
};

export default function GapsTab({ selected }) {
  const [showCompetitorPreview, setShowCompetitorPreview] = useState(false);
  const [expandedGap, setExpandedGap] = useState(null);

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
          <div key={i}>
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedGap(expandedGap === i ? null : i)}
            >
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
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${(gap.market / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400">market size</div>
                </div>
                {expandedGap === i ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded - Who fills this gap */}
            {expandedGap === i && (
              <div className="px-5 pb-5 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={12} className="text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">
                    PRO PREVIEW
                  </span>
                  <span className="text-xs text-gray-400">
                    Who fills this gap
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Brand A", "Brand B", "Brand C"].map((b, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded border border-gray-200 text-center"
                    >
                      <div className="text-sm font-medium text-gray-400 blur-sm">
                        $XX,XXX
                      </div>
                      <div className="text-xs text-gray-300 blur-sm">{b}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Upgrade to see competitor details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Competitor Performance Preview - Pro Feature Demo */}
      <div className="border border-dashed border-blue-300 rounded-xl overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setShowCompetitorPreview(!showCompetitorPreview)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                Competitor Performance
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <div className="text-sm text-gray-500">
                See how other brands perform at this retailer
              </div>
            </div>
          </div>
          <div className="text-sm text-blue-600 font-medium">
            {showCompetitorPreview ? "Hide Preview" : "Try Demo"}
          </div>
        </div>

        {showCompetitorPreview && (
          <div className="p-6 bg-white/80 space-y-4">
            <div className="text-xs text-gray-500 mb-2">
              Demo data - actual competitor names and figures available with Pro
            </div>

            {/* Competitor List */}
            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
              {competitorData.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {comp.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {comp.categories.map((c, j) => (
                          <span
                            key={j}
                            className="bg-gray-100 px-1.5 py-0.5 rounded"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${(comp.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-400">revenue</div>
                    </div>
                    <div className="text-right w-16">
                      <div className="flex items-center justify-end gap-1">
                        <TrendIcon trend={comp.trend} />
                        <span
                          className={`text-sm font-medium ${
                            comp.trend === "up"
                              ? "text-green-600"
                              : comp.trend === "down"
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {comp.trendPct > 0 ? "+" : ""}
                          {comp.trendPct}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">vs last mo</div>
                    </div>
                    <div className="text-right w-12">
                      <div className="text-sm font-medium text-gray-700">
                        {comp.marketShare}%
                      </div>
                      <div className="text-xs text-gray-400">share</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insight Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 text-sm">!</span>
                </div>
                <div>
                  <div className="font-medium text-amber-900 text-sm">
                    Competitive Insight
                  </div>
                  <div className="text-sm text-amber-700 mt-1">
                    Cascade Premium is growing fastest (+22%). They focus
                    exclusively on Flower - a category where{" "}
                    {selected?.name || "you"} could expand.
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 mb-3">
                With Pro, see real competitor names, detailed category
                breakdowns, and weekly trends.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pro Features Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            More with Pro
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
            feature="Weekly Trend Reports"
            description="Track how competitor performance changes week-over-week."
          />
        </div>
      </div>
    </div>
  );
}
