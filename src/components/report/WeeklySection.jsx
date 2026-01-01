import React from "react";
import { Calendar, AlertTriangle } from "lucide-react";
import ExpandableSection from "./ExpandableSection";

// Mock weekly data - would come from API
function getWeeklyData() {
  return [
    { week: "Week 29", transactions: 7, revenue: 138, products: 2, customers: 6 },
    { week: "Week 30", transactions: 15, revenue: 603, products: 3, customers: 9 },
    { week: "Week 31", transactions: 22, revenue: 633, products: 3, customers: 14 },
    { week: "Week 32", transactions: 6, revenue: 186, products: 2, customers: 6 },
    { week: "Week 33", transactions: 19, revenue: 640, products: 8, customers: 11 },
    { week: "Week 34", transactions: 19, revenue: 570, products: 10, customers: 10 },
    { week: "Week 35", transactions: 26, revenue: 887, products: 12, customers: 11 },
    { week: "Week 36", transactions: 26, revenue: 820, products: 11, customers: 15 },
    { week: "Week 37", transactions: 15, revenue: 469, products: 8, customers: 9 },
    { week: "Week 38 (PEAK)", transactions: 61, revenue: 1801, products: 11, customers: 37 },
    { week: "Week 39", transactions: 39, revenue: 895, products: 12, customers: 24 },
    { week: "Week 40", transactions: 33, revenue: 846, products: 11, customers: 17 },
    { week: "Week 41", transactions: 32, revenue: 1029, products: 10, customers: 19 },
    { week: "Week 42", transactions: 33, revenue: 783, products: 8, customers: 23 },
    { week: "Week 43", transactions: 27, revenue: 592, products: 10, customers: 17 },
    { week: "Week 44", transactions: 20, revenue: 613, products: 8, customers: 17 },
    { week: "Week 45", transactions: 13, revenue: 383, products: 10, customers: 10 },
    { week: "Week 46", transactions: 8, revenue: 243, products: 9, customers: 4 },
    { week: "Week 47", transactions: 9, revenue: 215, products: 9, customers: 6 },
    { week: "Week 48", transactions: 15, revenue: 469, products: 12, customers: 11 },
    { week: "Week 49", transactions: 16, revenue: 387, products: 11, customers: 12 },
    { week: "Week 50", transactions: 15, revenue: 442, products: 15, customers: 11 },
    { week: "Week 51", transactions: 17, revenue: 533, products: 15, customers: 13 },
  ];
}

export default function WeeklySection({ selected }) {
  const weeklyData = getWeeklyData();
  const maxRevenue = Math.max(...weeklyData.map((w) => w.revenue));
  const peakWeek = weeklyData.find((w) => w.revenue === maxRevenue);
  const recentWeeks = weeklyData.slice(-4);
  const avgRecent = recentWeeks.reduce((s, w) => s + w.revenue, 0) / recentWeeks.length;

  // Find the trough
  const troughWeek = weeklyData.reduce((min, w) => (w.revenue < min.revenue ? w : min));
  const declinePct = Math.round(((maxRevenue - troughWeek.revenue) / maxRevenue) * 100);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="text-amber-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Weekly Performance</h2>
          <p className="text-gray-500">Understanding your velocity and consistency</p>
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <div className="font-semibold text-gray-900 mb-1">
              {declinePct}% revenue swing detected
            </div>
            <div className="text-sm text-gray-600">
              Peak: {peakWeek?.week} (${maxRevenue.toLocaleString()}) →
              Trough: {troughWeek?.week} (${troughWeek?.revenue.toLocaleString()}).
              When you have strong inventory, customers respond.
            </div>
          </div>
        </div>
      </div>

      {/* Mini chart */}
      <div className="mb-6">
        <div className="flex items-end gap-1 h-24">
          {weeklyData.map((w) => (
            <div
              key={w.week}
              className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t hover:from-indigo-600 hover:to-indigo-500 transition-colors cursor-pointer group relative"
              style={{ height: `${(w.revenue / maxRevenue) * 100}%` }}
              title={`${w.week}: $${w.revenue}`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {w.week}: ${w.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Expandable detail */}
      <ExpandableSection
        title="Weekly Detail"
        summary={`${weeklyData.length} weeks of data`}
        downloadData={weeklyData}
        downloadFilename="weekly-performance.csv"
      >
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Week</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-right">Transactions</th>
                <th className="pb-2 text-right">Customers</th>
                <th className="pb-2 text-right">Products</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((w) => (
                <tr
                  key={w.week}
                  className={`border-b border-gray-100 ${w.revenue === maxRevenue ? "bg-green-50" : w.revenue === troughWeek.revenue ? "bg-red-50" : ""}`}
                >
                  <td className="py-2 font-medium">{w.week}</td>
                  <td className="py-2 text-right">${w.revenue.toLocaleString()}</td>
                  <td className="py-2 text-right">{w.transactions}</td>
                  <td className="py-2 text-right">{w.customers}</td>
                  <td className="py-2 text-right">{w.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ExpandableSection>
    </div>
  );
}
