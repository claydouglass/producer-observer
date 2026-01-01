import React from 'react';

export default function TypeCard({ type, forecastTotal, onClick }) {
  return (
    <button
      onClick={() => onClick(type.name.toLowerCase())}
      className="p-4 rounded-xl border border-gray-200 text-left hover:border-gray-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: type.color }}
          />
          <span className="text-sm font-medium text-gray-900">{type.name}</span>
        </div>
        <span
          className={`text-xs font-medium ${
            type.trend >= 0 ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {type.trend >= 0 ? '+' : ''}
          {type.trend}%
        </span>
      </div>
      <div className="text-xl font-semibold text-gray-900">
        ${Math.round((forecastTotal * type.pct) / 100).toLocaleString()}
      </div>
      <div className="text-xs text-gray-400 mt-1">{type.pct}% of mix</div>
      {type.alert && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          Supply constraint
        </div>
      )}
    </button>
  );
}
