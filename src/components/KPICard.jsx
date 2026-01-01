import React from 'react';

export default function KPICard({ label, value, sub, delta }) {
  return (
    <div className="p-5 rounded-xl border border-gray-200">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <span className="text-sm text-green-600 font-medium">{delta}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}
