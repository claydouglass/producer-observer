import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function ReportHeader({ selected, brands = [] }) {
  const topPct = Math.round((selected.rank / (brands.length || 174)) * 100);
  const isTopTen = topPct <= 10;

  // Determine trend from monthly data
  const months = Object.values(selected.byMonth || {});
  const recent = months.slice(-2);
  const trending = recent.length >= 2 && recent[1] > recent[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-10 text-white">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-3">{selected.name}</h1>
        <p className="text-xl text-slate-300 mb-8">
          Here's how you're doing at Miracle Greens Bend
        </p>
      </div>

      <div className="flex items-end gap-12">
        {/* Main number - the one that matters */}
        <div>
          <div className="text-7xl font-bold mb-2">#{selected.rank}</div>
          <div className="text-slate-400 text-lg">
            out of {brands.length || 174} brands
          </div>
        </div>

        {/* Revenue */}
        <div>
          <div className="text-4xl font-bold mb-2">
            ${Math.round(selected.revenue / 1000)}K
          </div>
          <div className="text-slate-400">total sales</div>
        </div>

        {/* Trend indicator */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            trending
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {trending ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="font-medium">
            {trending ? "Growing" : "Declining"}
          </span>
        </div>
      </div>

      {isTopTen && (
        <div className="mt-8 inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full">
          <span className="text-xl">⭐</span>
          <span className="font-medium">You're in the top 10%</span>
        </div>
      )}
    </div>
  );
}
