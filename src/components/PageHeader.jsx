import React from "react";

export default function PageHeader({
  selected,
  viewMode,
  retailerName,
  totalBrands = 50,
  monthlyRank,
}) {
  if (!selected) return null;

  const wholesale = selected.wholesaleByMonth?.Dec || 0;
  const rank = monthlyRank?.rank || selected.rank;
  const total = monthlyRank?.total || totalBrands;

  // Calculate percentile (lower rank = better)
  const percentile = Math.round(((total - rank) / total) * 100);

  // Determine rank tier for styling
  const isTop10 = rank <= Math.ceil(total * 0.1);
  const isTop25 = rank <= Math.ceil(total * 0.25);
  const isBottom50 = rank > Math.ceil(total * 0.5);

  // Get rank color and message
  const getRankStyle = () => {
    if (isTop10)
      return { bg: "bg-green-600", text: "text-white", message: "Top 10%" };
    if (isTop25)
      return { bg: "bg-blue-600", text: "text-white", message: "Top 25%" };
    if (isBottom50)
      return {
        bg: "bg-red-600",
        text: "text-white",
        message: `Bottom ${100 - percentile}%`,
      };
    return {
      bg: "bg-yellow-500",
      text: "text-white",
      message: "Middle of pack",
    };
  };

  const rankStyle = getRankStyle();

  return (
    <div className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-base font-semibold text-gray-900">
                {selected.name}
              </span>
              <span className="text-gray-300">×</span>
              <span className="text-base text-gray-600">{retailerName}</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Producer Observer
            </h1>
            {viewMode === "supplier" && selected.brands && (
              <div className="text-sm text-gray-500 mt-1">
                Distributes: {selected.brands.slice(0, 3).join(", ")}
                {selected.brands.length > 3 &&
                  ` +${selected.brands.length - 3} more`}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            {/* Rank - THE BIG NUMBER */}
            <div
              className={`${rankStyle.bg} rounded-xl px-5 py-3 text-center min-w-[140px]`}
            >
              <div
                className={`text-4xl font-black ${rankStyle.text} tracking-tight`}
              >
                #{rank}
              </div>
              <div className={`text-sm ${rankStyle.text} opacity-90`}>
                of {total} {viewMode === "supplier" ? "suppliers" : "brands"}
              </div>
              <div
                className={`text-xs ${rankStyle.text} opacity-75 mt-1 font-medium`}
              >
                {rankStyle.message}
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">December Revenue</div>
              <div className="text-3xl font-bold text-gray-900">
                ${wholesale.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {selected.marketShare}% market share
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
