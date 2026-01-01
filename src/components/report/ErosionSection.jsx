import React from "react";
import { Shield, Lock } from "lucide-react";

export default function ErosionSection({ selected }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Shield className="text-amber-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Watch your back
          </h2>
          <p className="text-gray-600">
            Other brands are trying to take your customers
          </p>
        </div>
      </div>

      <div className="bg-white/60 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Competitors gaining on you</span>
          <span className="flex items-center gap-2 text-amber-600 font-medium">
            <Lock size={16} />
            Pro feature
          </span>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 blur-sm" />
                <div className="h-3 bg-gray-100 rounded w-24 mt-1 blur-sm" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-16 blur-sm" />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold text-lg transition-colors">
        Upgrade to see who's catching up
      </button>
    </div>
  );
}
