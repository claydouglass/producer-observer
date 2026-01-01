import React from "react";
import { Lock, Zap, Package, TrendingUp } from "lucide-react";
import { simulateDecisions } from "../data/constants";
import { ProFeatureCard } from "./ProUpgradePrompt";

export default function SimulateTab({
  forecast,
  forecastMin,
  forecastMax,
  scenario,
  setScenario,
  decisions,
  setDecisions,
  calculateScenarioForecast,
}) {
  const toggleDecision = (key) => {
    setDecisions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Scenario Builder</h2>
        <p className="text-sm text-gray-500 mt-1">
          Model decisions and see forecast impact in real-time.
        </p>
      </div>

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

      {/* Pro Features Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            Unlock with Pro
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
