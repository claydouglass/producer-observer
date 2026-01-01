import React from "react";
import { BarChart3, AlertTriangle, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { SectionHeader, InsightCard } from "./ReportComponents";

export default function StorySection({ selected }) {
  const monthlyData = Object.entries(selected.byMonth || {}).map(([month, revenue]) => ({
    month, revenue,
  }));

  const peakMonth = monthlyData.reduce((max, m) => m.revenue > max.revenue ? m : max, monthlyData[0] || { revenue: 0 });
  const recentMonth = monthlyData[monthlyData.length - 1] || { revenue: 0 };
  const peakToRecentChange = peakMonth.revenue > 0
    ? Math.round(((recentMonth.revenue - peakMonth.revenue) / peakMonth.revenue) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <SectionHeader
        icon={BarChart3}
        title="The Story"
        subtitle="Your performance narrative over time"
      />

      {peakToRecentChange < -30 && (
        <InsightCard type="warning" icon={AlertTriangle} title="Significant Decline Detected">
          Revenue dropped {Math.abs(peakToRecentChange)}% from peak ({peakMonth.month}) to recent ({recentMonth.month}).
          Understanding why is critical for recovery.
        </InsightCard>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-2">Month</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-2">Revenue</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-2">Change</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((m, i) => {
              const prev = monthlyData[i - 1];
              const change = prev && prev.revenue > 0 ? Math.round(((m.revenue - prev.revenue) / prev.revenue) * 100) : 0;
              const isPeak = m.revenue === peakMonth.revenue;

              return (
                <tr key={m.month} className={`border-b border-gray-100 ${isPeak ? 'bg-green-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {m.month} 2025
                    {isPeak && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">PEAK</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">${m.revenue.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-right font-medium ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {i > 0 ? `${change > 0 ? '+' : ''}${change}%` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {change > 10 ? (
                      <span className="flex items-center gap-1 text-xs text-green-600"><ArrowUp size={14} />Growth</span>
                    ) : change < -10 ? (
                      <span className="flex items-center gap-1 text-xs text-red-600"><ArrowDown size={14} />Decline</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Minus size={14} />Stable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
