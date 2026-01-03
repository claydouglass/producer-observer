import React from "react";
import { CheckCircle, ChevronRight, Zap, FileText, Bell } from "lucide-react";
import {
  partnershipMetrics,
  ourPromises,
  theirPromises,
} from "../data/constants";
import { ProFeatureCard } from "./ProUpgradePrompt";

export default function PartnershipTab({ selected, brands = [] }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Partnership Health
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Live accountability metrics and working agreements.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {partnershipMetrics.map((m, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-500 mb-2">{m.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gray-900">
                {m.value}
              </span>
              <span className="text-xs text-gray-400">/ {m.target}</span>
            </div>
            <div
              className={`mt-2 w-full h-1 rounded-full ${
                m.status === "excellent"
                  ? "bg-green-500"
                  : m.status === "good"
                    ? "bg-green-400"
                    : "bg-amber-400"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-gray-200">
          <div className="text-sm font-medium text-gray-900 mb-4">
            Our promises to keep
          </div>
          <div className="space-y-3">
            {ourPromises.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm text-gray-600"
              >
                <CheckCircle
                  size={16}
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200">
          <div className="text-sm font-medium text-gray-900 mb-4">
            Your promises to keep
          </div>
          <div className="space-y-3">
            {theirPromises.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm text-gray-600"
              >
                <ChevronRight
                  size={16}
                  className="text-gray-400 mt-0.5 flex-shrink-0"
                />
                {item}
              </div>
            ))}
          </div>
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
        <div className="grid grid-cols-2 gap-4">
          <ProFeatureCard
            icon={FileText}
            feature="Letters of Intent"
            description="Generate and send LOIs based on forecast commitments."
          />
          <ProFeatureCard
            icon={Bell}
            feature="Smart Alerts"
            description="Get notified of stockout risks, demand spikes, and partnership issues."
          />
        </div>
      </div>
    </div>
  );
}
