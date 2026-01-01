import React from "react";
import { AlertCircle, Lock } from "lucide-react";

export default function ErosionSection({ selected }) {
  const threats = [
    "Brand gaining share in your Flower segment",
    "Price competition in Premium tier",
    "New entrant capturing your Indica customers"
  ];

  return (
    <div className="border-2 border-dashed border-red-300 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              Brand Erosion Analysis
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">PRO</span>
            </div>
            <div className="text-sm text-gray-500">Early warning system for competitive threats</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/80 rounded-xl p-4 border border-red-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Erosion Risk</div>
            <div className="text-2xl font-bold text-red-600 mt-1">MEDIUM</div>
            <div className="text-sm text-gray-500">Based on 8 factors</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 border border-red-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Customers at Risk</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">23</div>
            <div className="text-sm text-gray-500">buying less of you</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 border border-red-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Revenue at Risk</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">$2,340</div>
            <div className="text-sm text-gray-500">if trend continues</div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-4 border border-red-100 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Top Erosion Threats</div>
          <div className="space-y-2">
            {threats.map((threat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Lock size={12} className="text-gray-400" />
                <span className="blur-sm">{threat}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
          Upgrade to Pro - See Full Erosion Analysis
        </button>
      </div>
    </div>
  );
}
