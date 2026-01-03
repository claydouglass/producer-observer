import React from 'react';

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const d = payload[0]?.payload;
  const isHistory = d?.type === 'history';

  return (
    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <div className="font-medium">
        {label} {isHistory ? '2025' : '2026'}
      </div>
      {isHistory ? (
        <div className="text-gray-300 mt-1">${d.value?.toLocaleString()}</div>
      ) : (
        <>
          <div className="text-blue-300 mt-1">
            Base: ${d.value?.toLocaleString()}
          </div>
          <div className="text-gray-400 text-xs">
            Range: ${d.min?.toLocaleString()} – ${d.max?.toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}
