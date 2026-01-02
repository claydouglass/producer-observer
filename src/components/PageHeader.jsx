import React from "react";

export default function PageHeader({ selected, viewMode, retailerName }) {
  if (!selected) return null;

  const totalBrands = 174; // from data
  const wholesale = selected.wholesale || 0;

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
                <div className="text-sm text-gray-500">Rank</div>
                <div className="text-2xl font-semibold text-gray-900">
                  #{selected.rank}
                  <span className="text-sm text-gray-400 font-normal">
                    /{totalBrands}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Wholesale</div>
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
