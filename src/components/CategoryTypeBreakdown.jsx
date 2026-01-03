import React, { useMemo } from "react";
import {
  getCategoryByDateRange,
  getTypeByDateRange,
  sumByDateRange,
} from "../utils/rankings";

export default function CategoryTypeBreakdown({ selected, timeframe = "all" }) {
  if (!selected) return null;

  // Get exact category data for timeframe
  const categoryByTimeframe = useMemo(
    () => getCategoryByDateRange(selected.categoryByDate, timeframe),
    [selected, timeframe],
  );

  // Get exact type data for timeframe
  const typeByTimeframe = useMemo(
    () => getTypeByDateRange(selected.typeByDate, timeframe),
    [selected, timeframe],
  );

  // Calculate total for percentages
  const totalWholesale = useMemo(() => {
    const totals = sumByDateRange(selected.byDate, timeframe);
    return totals.wholesale || 1;
  }, [selected, timeframe]);

  // Category data with exact values
  const categoryData = Object.entries(categoryByTimeframe)
    .map(([name, data]) => ({
      name,
      wholesale: Math.round(data.wholesale),
      pct: Math.round((data.wholesale / totalWholesale) * 100),
    }))
    .sort((a, b) => b.wholesale - a.wholesale);

  // Type data - consolidate to 3 buckets with exact values
  const consolidatedTypes = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(typeByTimeframe).forEach(([type, data]) => {
    const t = type.toLowerCase();
    if (t.includes("indica")) consolidatedTypes.Indica += data.wholesale;
    else if (t.includes("sativa")) consolidatedTypes.Sativa += data.wholesale;
    else consolidatedTypes.Hybrid += data.wholesale;
  });

  const typeData = Object.entries(consolidatedTypes)
    .filter(([_, v]) => v > 0)
    .map(([name, wholesale]) => ({
      name,
      wholesale: Math.round(wholesale),
      pct: Math.round((wholesale / totalWholesale) * 100),
    }))
    .sort((a, b) => b.wholesale - a.wholesale);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">
          By Category
        </div>
        <div className="space-y-2">
          {categoryData.map((c) => (
            <div
              key={c.name}
              className="flex justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium">{c.name}</span>
              <span>
                ${c.wholesale.toLocaleString()} ({c.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">By Type</div>
        <div className="space-y-2">
          {typeData.map((t) => (
            <div
              key={t.name}
              className="flex justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium">{t.name}</span>
              <span>
                ${t.wholesale.toLocaleString()} ({t.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
