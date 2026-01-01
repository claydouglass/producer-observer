import React from 'react';

export default function CategoryCard({ cat, forecastTotal, onClick }) {
  return (
    <button
      onClick={() => onClick(cat.id)}
      className="p-4 rounded-xl border border-gray-200 text-left hover:border-gray-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: cat.color }}
        />
        <span className="text-sm text-gray-600">{cat.name}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold text-gray-900">
          ${Math.round((forecastTotal * cat.pct) / 100).toLocaleString()}
        </span>
        <span
          className={`text-xs font-medium ${
            cat.delta >= 0 ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {cat.delta >= 0 ? '+' : ''}
          {cat.delta}%
        </span>
      </div>
    </button>
  );
}
