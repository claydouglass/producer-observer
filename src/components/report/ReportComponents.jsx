import React, { useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight,
  Star, Lightbulb
} from "lucide-react";

// Stripe-style stat card
export function StatCard({ label, value, subValue, trend, trendValue, highlight, size = "default" }) {
  return (
    <div className={`${highlight ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`${size === "large" ? "text-3xl" : "text-2xl"} font-semibold text-gray-900 mt-1`}>{value}</div>
      {subValue && <div className="text-sm text-gray-500 mt-0.5">{subValue}</div>}
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
        }`}>
          {trend === "up" ? <TrendingUp size={14} /> : trend === "down" ? <TrendingDown size={14} /> : <Minus size={14} />}
          {trendValue}
        </div>
      )}
    </div>
  );
}

// Section header component
export function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// Insight callout
export function InsightCard({ type = "info", icon: Icon, title, children }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
    danger: "bg-red-50 border-red-200 text-red-800",
    opportunity: "bg-purple-50 border-purple-200 text-purple-800",
  };
  const iconColors = {
    info: "text-blue-600", warning: "text-amber-600", success: "text-green-600",
    danger: "text-red-600", opportunity: "text-purple-600",
  };

  return (
    <div className={`${styles[type]} border rounded-xl p-4 mt-4`}>
      <div className="flex items-start gap-3">
        <div className={`${iconColors[type]} mt-0.5`}>
          {Icon ? <Icon size={18} /> : <Lightbulb size={18} />}
        </div>
        <div>
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Ranking badge
export function RankBadge({ rank, total, size = "default" }) {
  const isTop10 = rank <= Math.ceil(total * 0.1);
  const isTop25 = rank <= Math.ceil(total * 0.25);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
      isTop10 ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" :
      isTop25 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
    } ${size === "large" ? "text-lg font-bold px-4 py-2" : "text-sm font-semibold"}`}>
      {isTop10 && <Star size={size === "large" ? 18 : 14} />}
      #{rank}
      <span className={`${size === "large" ? "text-sm" : "text-xs"} opacity-75`}>of {total}</span>
    </div>
  );
}

// Collapsible section
export function CollapsibleSection({ title, defaultOpen = false, children, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{title}</span>
          {badge}
        </div>
        {open ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}
