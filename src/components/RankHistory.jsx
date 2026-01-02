import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Trophy } from "lucide-react";

function getTrendIcon(current, previous) {
  if (!previous) return null;
  if (current < previous) return <TrendingUp size={14} className="text-green-500" />;
  if (current > previous) return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

function getRankChange(current, previous) {
  if (!previous) return null;
  const change = previous - current;
  if (change > 0) return `+${change}`;
  if (change < 0) return `${change}`;
  return "—";
}

export default function RankHistory({ selected }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("overall");

  const rankHistory = selected.rankHistory;
  if (!rankHistory) return null;

  const overallData = rankHistory.overall || [];
  const categoryData = rankHistory.byCategory || {};
  const categories = ["overall", ...Object.keys(categoryData)];

  // Find peak rank
  const peakMonth = overallData.reduce((best, curr) =>
    curr.rank < best.rank ? curr : best,
    overallData[0] || { rank: 999 }
  );

  // Current vs peak
  const currentRank = overallData[overallData.length - 1]?.rank;
  const isAtPeak = currentRank === peakMonth.rank;

  // Get data for selected view
  const displayData = selectedCategory === "overall"
    ? overallData
    : categoryData[selectedCategory] || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          <span className="font-semibold text-gray-900">Your Ranking Journey</span>
        </div>
        {peakMonth && (
          <div className="text-sm text-gray-500">
            Peak: <span className="font-medium text-green-600">#{peakMonth.rank}</span> in {peakMonth.month}
          </div>
        )}
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-gray-900">#{currentRank}</div>
          <div className="text-sm text-gray-500">
            current rank
            {!isAtPeak && peakMonth && (
              <div className="text-xs text-amber-600">
                was #{peakMonth.rank} in {peakMonth.month}
              </div>
            )}
          </div>
        </div>

        {/* Mini sparkline of ranks */}
        <div className="flex-1 flex items-end gap-1 h-12">
          {overallData.map((d, i) => {
            const maxRank = Math.max(...overallData.map(x => x.rank));
            const height = ((maxRank - d.rank + 1) / maxRank) * 100;
            const isPeak = d.rank === peakMonth.rank;
            return (
              <div
                key={d.month}
                className={`flex-1 rounded-t transition-all ${isPeak ? "bg-green-500" : "bg-indigo-400"}`}
                style={{ height: `${Math.max(height, 10)}%` }}
                title={`${d.month}: #${d.rank}`}
              />
            );
          })}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        {expanded ? "Hide" : "See"} monthly breakdown
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="mt-4">
          {/* Category selector */}
          <div className="flex gap-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "overall" ? "Overall" : cat}
              </button>
            ))}
          </div>

          {/* Rank table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Month</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">Rank</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">Change</th>
                  {selectedCategory === "overall" && (
                    <th className="text-right px-4 py-2 text-gray-500 font-medium">Wholesale</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayData.map((d, i) => {
                  const prev = displayData[i - 1];
                  const isPeak = selectedCategory === "overall"
                    ? d.rank === peakMonth.rank
                    : d.rank === Math.min(...displayData.map(x => x.rank));

                  return (
                    <tr
                      key={d.month}
                      className={`border-t border-gray-100 ${isPeak ? "bg-green-50" : ""}`}
                    >
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {d.month}
                        {isPeak && <span className="ml-2 text-xs text-green-600 font-medium">PEAK</span>}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-semibold ${isPeak ? "text-green-600" : "text-gray-900"}`}>
                          #{d.rank}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="flex items-center justify-end gap-1">
                          {getTrendIcon(d.rank, prev?.rank)}
                          <span className={`text-sm ${
                            prev && d.rank < prev.rank ? "text-green-600" :
                            prev && d.rank > prev.rank ? "text-red-500" : "text-gray-400"
                          }`}>
                            {getRankChange(d.rank, prev?.rank)}
                          </span>
                        </span>
                      </td>
                      {selectedCategory === "overall" && (
                        <td className="px-4 py-2 text-right text-gray-600">
                          ${d.wholesale?.toLocaleString() || "—"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Insight */}
          {selectedCategory === "overall" && peakMonth && !isAtPeak && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
              You peaked at <strong>#{peakMonth.rank}</strong> in <strong>{peakMonth.month}</strong> with ${peakMonth.wholesale?.toLocaleString()} wholesale.
              {currentRank > peakMonth.rank + 5 && " Understanding what changed could help you climb back."}
            </div>
          )}

          {selectedCategory !== "overall" && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
              Your best {selectedCategory} rank was <strong>#{Math.min(...displayData.map(x => x.rank))}</strong>.
              {categoryData[selectedCategory]?.slice(-1)[0]?.rank <= 5 && " You're a top performer in this category!"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
