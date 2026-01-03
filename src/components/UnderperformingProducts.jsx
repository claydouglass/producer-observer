import React from "react";

export default function UnderperformingProducts({ products = [] }) {
  const underperformers = products.filter(p => p.wholesale < 50);

  if (underperformers.length === 0) return null;

  return (
    <div className="space-y-2">
      {underperformers.map((p, i) => (
        <div key={i} className="flex justify-between p-3 bg-red-50 rounded-lg border border-red-200">
          <span className="font-medium text-gray-900">{p.name}</span>
          <span className="text-red-600">${p.wholesale} - Cut?</span>
        </div>
      ))}
    </div>
  );
}
