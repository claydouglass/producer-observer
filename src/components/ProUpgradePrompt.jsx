import React from 'react';
import { Lock, Zap } from 'lucide-react';

export default function ProUpgradePrompt({ feature, description }) {
  return (
    <div className="relative">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {feature}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <Zap size={16} />
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProFeatureCard({ feature, description, icon: Icon }) {
  return (
    <div className="p-6 rounded-xl border border-dashed border-gray-300 bg-gray-50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          {Icon ? <Icon size={20} className="text-gray-400" /> : <Lock size={20} className="text-gray-400" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900">{feature}</h3>
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium">
              PRO
            </span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
