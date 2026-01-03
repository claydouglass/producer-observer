import React from "react";
import { TrendingUp } from "lucide-react";

export default function CompetitorRanking({ ranking, selected }) {
  if (!ranking) return null;

  return (
    <div className="space-y-1">
      {ranking.above.map((b, i) => (
        <div
          key={b.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
              {ranking.rank - (ranking.above.length - i)}
            </div>
            <span className="font-medium text-gray-700">{b.name}</span>
          </div>
          <span className="font-semibold text-gray-700">
            ${Math.round(b.segmentWholesale).toLocaleString()}
          </span>
        </div>
      ))}

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-blue-600">
            {ranking.rank}
          </div>
          <div>
            <div className="font-bold">
              {selected.name}{" "}
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">YOU</span>
            </div>
            <div className="text-xs text-blue-200">
              #{ranking.rank} of {ranking.total}
            </div>
          </div>
        </div>
        <div className="text-xl font-bold">
          ${Math.round(ranking.selected.segmentWholesale).toLocaleString()}
        </div>
      </div>

      {ranking.below.map((b, i) => (
        <div
          key={b.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-red-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm font-bold text-red-600">
              {ranking.rank + i + 1}
            </div>
            <div>
              <div className="font-medium text-gray-700">{b.name}</div>
              <div className="text-xs text-red-500 flex items-center gap-1">
                <TrendingUp size={10} />
                Gaining
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-700">
              ${Math.round(b.segmentWholesale).toLocaleString()}
            </div>
            <div className="text-xs text-red-600">
              ${Math.round(ranking.selected.segmentWholesale - b.segmentWholesale).toLocaleString()} behind
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
