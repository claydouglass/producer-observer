import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

function getWeeklyData() {
  return [
    { week: "Week 29", transactions: 7, wholesale: 62, customers: 6 },
    { week: "Week 30", transactions: 15, wholesale: 271, customers: 9 },
    { week: "Week 31", transactions: 22, wholesale: 285, customers: 14 },
    { week: "Week 32", transactions: 6, wholesale: 84, customers: 6 },
    { week: "Week 33", transactions: 19, wholesale: 288, customers: 11 },
    { week: "Week 34", transactions: 19, wholesale: 257, customers: 10 },
    { week: "Week 35", transactions: 26, wholesale: 399, customers: 11 },
    { week: "Week 36", transactions: 26, wholesale: 369, customers: 15 },
    { week: "Week 37", transactions: 15, wholesale: 211, customers: 9 },
    { week: "Week 38", transactions: 61, wholesale: 810, customers: 37 },
    { week: "Week 39", transactions: 39, wholesale: 403, customers: 24 },
    { week: "Week 40", transactions: 33, wholesale: 381, customers: 17 },
    { week: "Week 41", transactions: 32, wholesale: 463, customers: 19 },
    { week: "Week 42", transactions: 33, wholesale: 352, customers: 23 },
    { week: "Week 43", transactions: 27, wholesale: 266, customers: 17 },
    { week: "Week 44", transactions: 20, wholesale: 276, customers: 17 },
    { week: "Week 45", transactions: 13, wholesale: 172, customers: 10 },
    { week: "Week 46", transactions: 8, wholesale: 109, customers: 4 },
    { week: "Week 47", transactions: 9, wholesale: 97, customers: 6 },
    { week: "Week 48", transactions: 15, wholesale: 211, customers: 11 },
    { week: "Week 49", transactions: 16, wholesale: 174, customers: 12 },
    { week: "Week 50", transactions: 15, wholesale: 199, customers: 11 },
    { week: "Week 51", transactions: 17, wholesale: 240, customers: 13 },
  ];
}

export default function WeeklySection({ selected }) {
  const [expanded, setExpanded] = useState(false);
  const weeklyData = getWeeklyData();
  const maxWholesale = Math.max(...weeklyData.map((w) => w.wholesale));
  const peakWeek = weeklyData.find((w) => w.wholesale === maxWholesale);
  const troughWeek = weeklyData.reduce((min, w) =>
    w.wholesale < min.wholesale ? w : min,
  );
  const declinePct = Math.round(
    ((maxWholesale - troughWeek.wholesale) / maxWholesale) * 100,
  );

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-amber-500" size={18} />
          <span className="text-sm font-medium text-gray-900">
            Weekly Performance
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {expanded ? "Hide" : "Show"} details
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Quick insight */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg mb-4">
        <AlertTriangle
          className="text-amber-600 flex-shrink-0 mt-0.5"
          size={14}
        />
        <div className="text-sm">
          <span className="font-medium text-gray-900">{declinePct}% swing</span>
          <span className="text-gray-600">
            {" "}
            — Peak ${maxWholesale} → Trough ${troughWeek.wholesale}
          </span>
        </div>
      </div>

      {/* Mini chart - always visible */}
      <div className="flex items-end gap-0.5 h-16">
        {weeklyData.map((w) => (
          <div
            key={w.week}
            className={`flex-1 rounded-t transition-colors ${
              w.wholesale === maxWholesale
                ? "bg-green-500"
                : w.wholesale === troughWeek.wholesale
                  ? "bg-red-400"
                  : "bg-indigo-400"
            }`}
            style={{ height: `${(w.wholesale / maxWholesale) * 100}%` }}
            title={`${w.week}: $${w.wholesale}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Jul</span>
        <span>Sep</span>
        <span>Dec</span>
      </div>

      {expanded && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">
                    Week
                  </th>
                  <th className="text-right px-3 py-2 text-gray-500 font-medium">
                    Revenue
                  </th>
                  <th className="text-right px-3 py-2 text-gray-500 font-medium">
                    Trans
                  </th>
                  <th className="text-right px-3 py-2 text-gray-500 font-medium">
                    Customers
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((w) => (
                  <tr
                    key={w.week}
                    className={`border-t border-gray-100 ${
                      w.wholesale === maxWholesale
                        ? "bg-green-50"
                        : w.wholesale === troughWeek.wholesale
                          ? "bg-red-50"
                          : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {w.week}
                    </td>
                    <td className="px-3 py-2 text-right">${w.wholesale}</td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {w.transactions}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {w.customers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
