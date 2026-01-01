import React from "react";
import { Download, Gift } from "lucide-react";

export default function ReportHeader({ selected, brands = [] }) {
  const grossProfit = Math.round(selected.revenue * 0.61);
  const avgTransaction = selected.transactions > 0 ? Math.round(selected.revenue / selected.transactions) : 0;
  const topPct = Math.round((selected.rank / (brands.length || 174)) * 100);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-indigo-300 text-sm font-medium mb-2">Producer Intelligence Report</div>
          <h1 className="text-3xl font-bold mb-2">{selected.name}</h1>
          <p className="text-slate-300 text-sm">
            Strategic Partner Briefing · Data Period: May - Dec 2025
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-sm font-medium transition-colors">
            <Gift size={16} />
            Share with Partner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 mt-8">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-indigo-300 text-xs font-medium">OVERALL RANK</div>
          <div className="text-2xl font-bold mt-1">#{selected.rank}</div>
          <div className="text-indigo-300 text-xs mt-1">of {brands.length || 174} brands</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-indigo-300 text-xs font-medium">TOTAL REVENUE</div>
          <div className="text-2xl font-bold mt-1">${selected.revenue.toLocaleString()}</div>
          <div className="text-indigo-300 text-xs mt-1">{selected.marketShare}% share</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-indigo-300 text-xs font-medium">GROSS PROFIT</div>
          <div className="text-2xl font-bold mt-1">${grossProfit.toLocaleString()}</div>
          <div className="text-indigo-300 text-xs mt-1">61% margin</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-indigo-300 text-xs font-medium">TRANSACTIONS</div>
          <div className="text-2xl font-bold mt-1">{selected.transactions.toLocaleString()}</div>
          <div className="text-indigo-300 text-xs mt-1">${avgTransaction} avg</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-indigo-300 text-xs font-medium">CUSTOMERS</div>
          <div className="text-2xl font-bold mt-1">{selected.customers}</div>
          <div className="text-indigo-300 text-xs mt-1">unique buyers</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-indigo-300 text-xs font-medium">POSITION</div>
          <div className="text-2xl font-bold mt-1">Top {topPct}%</div>
          <div className="text-indigo-300 text-xs mt-1">of all brands</div>
        </div>
      </div>
    </div>
  );
}
