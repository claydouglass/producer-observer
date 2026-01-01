import React from "react";
import { Users, Award } from "lucide-react";
import { SectionHeader, StatCard, InsightCard } from "./ReportComponents";

export default function CustomerSection({ selected }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <SectionHeader
        icon={Users}
        title="Customer Quality"
        subtitle="How your customers compare to store average"
      />

      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Avg LTV" value="$496" subValue="vs $251 avg" trend="up" trendValue="2.0x index" highlight />
        <StatCard label="Avg Visits" value="14.0" subValue="vs 8.6 avg" trend="up" trendValue="1.6x index" />
        <StatCard label="Brands Purchased" value="8.5" subValue="vs 3.9 avg" trend="up" trendValue="2.2x index" />
        <StatCard label="Loyalty Rate" value="30%" subValue="repeat buyers" />
      </div>

      <InsightCard type="success" icon={Award} title="Premium Customer Base">
        {selected.name} attracts high-value, multi-brand customers. These are exactly the customers we want to retain.
      </InsightCard>
    </div>
  );
}
