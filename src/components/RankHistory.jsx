import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function RankHistory({ selected }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("overall");

  const rankHistory = selected.rankHistory;
  if (!rankHistory) return null;

  const overallData = rankHistory.overall || [];
  const categoryData = rankHistory.byCategory || {};
  const categories = ["overall", ...Object.keys(categoryData)];

  if (overallData.length === 0) return null;

  // Find peak rank (lowest number = best)
  const peakMonth = overallData.reduce(
    (best, curr) => (curr.rank < best.rank ? curr : best),
    overallData[0],
  );

  const currentRank = overallData[overallData.length - 1]?.rank;
  const firstRank = overallData[0]?.rank;
  const improved = currentRank < firstRank;
  const declined = currentRank > firstRank;

  // Get data for selected view
  const displayData =
    selectedCategory === "overall"
      ? overallData
      : categoryData[selectedCategory] || [];

  // Use actual rank values - we'll reverse the Y axis so lower rank (better) is at top
  const minRank = Math.min(...displayData.map((d) => d.rank));
  const maxRank = Math.max(...displayData.map((d) => d.rank));
  const chartData = displayData.map((d) => ({
    ...d,
    displayRank: d.rank,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.month}</p>
          <p className="text-lg font-bold text-gray-900">#{data.displayRank}</p>
          {data.wholesale && (
            <p className="text-sm text-gray-500">
              ${data.wholesale.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-3xl font-bold text-gray-900">
              #{currentRank}
            </span>
            <span className="text-sm text-gray-500 ml-2">in Dec</span>
          </div>
          {improved && (
            <span className="text-sm text-green-600 font-medium">
              ↑ {firstRank - currentRank} from May
            </span>
          )}
          {declined && (
            <span className="text-sm text-red-500 font-medium">
              ↓ {currentRank - firstRank} from May
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Peak:{" "}
          <span className="font-medium text-green-600">#{peakMonth.rank}</span>{" "}
          in {peakMonth.month}
        </div>
      </div>

      {/* Category selector */}
      {categories.length > 1 && (
        <div className="flex gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "overall" ? "Overall" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              domain={[Math.max(1, minRank - 2), maxRank + 2]}
              reversed={true}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(value) => `#${Math.round(value)}`}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="displayRank"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expand for table */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-4"
      >
        {expanded ? "Hide" : "See"} details
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">
                  Month
                </th>
                <th className="text-right px-4 py-2 text-gray-500 font-medium">
                  Rank
                </th>
                <th className="text-right px-4 py-2 text-gray-500 font-medium">
                  Change
                </th>
                {selectedCategory === "overall" && (
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">
                    Revenue
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayData.map((d, i) => {
                const prev = displayData[i - 1];
                const isPeak =
                  d.rank === Math.min(...displayData.map((x) => x.rank));
                const change = prev ? prev.rank - d.rank : 0;

                return (
                  <tr
                    key={d.month}
                    className={`border-t border-gray-100 ${isPeak ? "bg-green-50" : ""}`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {d.month}
                      {isPeak && (
                        <span className="ml-2 text-xs text-green-600">
                          PEAK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">
                      #{d.rank}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {change > 0 && (
                        <span className="text-green-600">↑{change}</span>
                      )}
                      {change < 0 && (
                        <span className="text-red-500">
                          ↓{Math.abs(change)}
                        </span>
                      )}
                      {change === 0 && prev && (
                        <span className="text-gray-400">—</span>
                      )}
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
      )}
    </div>
  );
}
