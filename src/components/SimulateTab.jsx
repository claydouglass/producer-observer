import React, { useState, useMemo } from "react";
import {
  Lock,
  Zap,
  Package,
  TrendingUp,
  Calendar,
  Sliders,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { simulateDecisions } from "../data/constants";
import { ProFeatureCard } from "./ProUpgradePrompt";

// Demo production planning data - illustrative timing scenarios
const productionScenarios = [
  {
    id: "q1",
    label: "Q1 Push",
    timing: "Jan-Mar",
    desc: "Early season launch",
  },
  {
    id: "q2",
    label: "Q2 Steady",
    timing: "Apr-Jun",
    desc: "Maintain current pace",
  },
  {
    id: "q3",
    label: "Q3 Ramp",
    timing: "Jul-Sep",
    desc: "Summer demand surge",
  },
  {
    id: "q4",
    label: "Q4 Peak",
    timing: "Oct-Dec",
    desc: "Holiday preparation",
  },
];

const categoryMix = [
  { id: "flower", label: "Flower", current: 45, icon: "🌿" },
  { id: "preroll", label: "Pre-Rolls", current: 25, icon: "🚬" },
  { id: "vape", label: "Vape", current: 20, icon: "💨" },
  { id: "edible", label: "Edibles", current: 10, icon: "🍬" },
];

export default function SimulateTab({
  forecast,
  forecastMin,
  forecastMax,
  scenario,
  setScenario,
  decisions,
  setDecisions,
  calculateScenarioForecast,
  selectedBrand,
}) {
  const [productionTiming, setProductionTiming] = useState("q2");
  const [categoryAllocation, setCategoryAllocation] = useState(
    categoryMix.reduce((acc, c) => ({ ...acc, [c.id]: c.current }), {}),
  );
  const [showProPreview, setShowProPreview] = useState(false);

  const toggleDecision = (key) => {
    setDecisions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCategoryChange = (id, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setCategoryAllocation((prev) => ({ ...prev, [id]: newValue }));
  };

  // Calculate simulated outcomes based on selections
  const simulatedOutcome = useMemo(() => {
    const timingMultiplier = {
      q1: 0.85,
      q2: 1.0,
      q3: 1.15,
      q4: 1.25,
    }[productionTiming];

    const totalAllocation = Object.values(categoryAllocation).reduce(
      (a, b) => a + b,
      0,
    );
    const balanceScore = totalAllocation === 100 ? 1 : 0.9;

    const baseForecast = calculateScenarioForecast(scenario);
    const adjusted = Math.round(baseForecast * timingMultiplier * balanceScore);

    return {
      revenue: adjusted,
      timing: productionTiming,
      balance: totalAllocation,
      risk:
        totalAllocation !== 100
          ? "Allocation imbalance"
          : productionTiming === "q1"
            ? "Early timing risk"
            : null,
    };
  }, [
    productionTiming,
    categoryAllocation,
    scenario,
    calculateScenarioForecast,
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Scenario Builder</h2>
        <p className="text-sm text-gray-500 mt-1">
          Model decisions and see forecast impact in real-time.
        </p>
      </div>

      {/* Main Forecast Display */}
      <div className="p-8 rounded-xl border border-gray-200 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Projected 6-Month Forecast
        </div>
        <div className="text-5xl font-semibold text-gray-900">
          ${forecast.toLocaleString()}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Range: ${forecastMin.toLocaleString()} – $
          {forecastMax.toLocaleString()}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          {["conservative", "base", "upside"].map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-4 py-2 rounded-lg text-sm ${
                scenario === s
                  ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="text-xs text-gray-400 mb-0.5">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
              <div className="font-semibold">
                ${calculateScenarioForecast(s).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Decision Toggles */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-4">
          Toggle decisions to see impact
        </div>
        <div className="space-y-3">
          {simulateDecisions.map((item) => (
            <div
              key={item.key}
              onClick={() => toggleDecision(item.key)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${
                decisions[item.key]
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-6 rounded-full flex items-center ${
                    decisions[item.key]
                      ? "bg-blue-500 justify-end"
                      : "bg-gray-200 justify-start"
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${
                  decisions[item.key]
                    ? "text-green-600"
                    : item.key === "indicaSupply"
                      ? "text-red-500"
                      : "text-gray-400"
                }`}
              >
                {decisions[item.key]
                  ? item.impact
                  : item.impactNeg || "Inactive"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Planning Preview - Pro Feature Demo */}
      <div className="border border-dashed border-blue-300 rounded-xl overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setShowProPreview(!showProPreview)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Sliders size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                Production Planning Preview
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Explore timing and category mix scenarios
              </div>
            </div>
          </div>
          <div className="text-sm text-blue-600 font-medium">
            {showProPreview ? "Hide Preview" : "Try Demo"}
          </div>
        </div>

        {showProPreview && (
          <div className="p-6 bg-white/80 space-y-6">
            {/* Timing Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Production Timing
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productionScenarios.map((ps) => (
                  <button
                    key={ps.id}
                    onClick={() => setProductionTiming(ps.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      productionTiming === ps.id
                        ? "border-blue-400 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {ps.label}
                    </div>
                    <div className="text-xs text-gray-500">{ps.timing}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Mix */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Category Allocation %
                </span>
                <span
                  className={`text-xs ml-auto ${
                    simulatedOutcome.balance === 100
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  Total: {simulatedOutcome.balance}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categoryMix.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">
                        {cat.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        Current: {cat.current}%
                      </div>
                    </div>
                    <input
                      type="number"
                      value={categoryAllocation[cat.id]}
                      onChange={(e) =>
                        handleCategoryChange(cat.id, e.target.value)
                      }
                      className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Result */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Simulated Outcome</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    ${simulatedOutcome.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  {simulatedOutcome.risk ? (
                    <div className="flex items-center gap-1 text-amber-600 text-sm">
                      <AlertTriangle size={14} />
                      {simulatedOutcome.risk}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle size={14} />
                      Balanced allocation
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 mb-3">
                This is a demo. With Pro, connect your ERP for real numbers and
                save scenarios.
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
        <div className="space-y-3">
          <ProFeatureCard
            icon={Package}
            feature="Pre-Allocate Inventory"
            description="Reserve inventory based on demand forecasts. Ensure supply meets projected demand."
          />
          <ProFeatureCard
            icon={TrendingUp}
            feature="Real-Time ERP Sync"
            description="Connect your production system for live inventory and capacity planning."
          />
        </div>
      </div>
    </div>
  );
}
