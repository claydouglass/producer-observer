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
          <div className="text-right">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm text-gray-500">Rank (Dec)</div>
                <div className="text-2xl font-semibold text-gray-900">
                  #{rank}
                  <span className="text-sm text-gray-400 font-normal">
                    /{monthlyRank?.total || totalBrands}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Revenue (Dec)</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${wholesale.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Market Share</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {selected.marketShare}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
