import React from "react";
import { Shield, Lock } from "lucide-react";

export default function ErosionSection({ selected }) {
  return (
    <div className="p-6 rounded-xl border border-amber-200 bg-amber-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="text-amber-600" size={18} />
          <span className="text-sm font-medium text-gray-900">
            Competitive Threats
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-amber-600">
          <Lock size={12} />
          Pro
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white/60 rounded-lg"
          >
            <div className="w-6 h-6 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-24 blur-sm" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-12 blur-sm" />
          </div>
        ))}
      </div>

      <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
        Upgrade to see threats
      </button>
    </div>
  );
}
