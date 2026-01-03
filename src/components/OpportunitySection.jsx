import React from "react";

export default function OpportunitySection({ selected }) {
  if (!selected) return null;

  const categoryData = Object.entries(selected.wholesaleByCategory || {})
    .map(([name, wholesale]) => ({ name, wholesale }))
    .sort((a, b) => b.wholesale - a.wholesale);

  // Simple trend inference from rank history if available
  const opportunities = [];

  if (selected.rankHistory?.byCategory) {
    Object.entries(selected.rankHistory.byCategory).forEach(
      ([cat, history]) => {
        if (history.length >= 2) {
          const first = history[0].rank;
          const last = history[history.length - 1].rank;
          if (last < first) {
            opportunities.push({
              category: cat,
              type: "growing",
              message: `${cat}: Climbing from #${first} to #${last}. Double down.`,
            });
          } else if (last > first + 3) {
            opportunities.push({
              category: cat,
              type: "declining",
              message: `${cat}: Dropped from #${first} to #${last}. Needs attention.`,
            });
          }
        }
      },
    );
  }

  // Fallback if no rank history
  if (opportunities.length === 0 && categoryData.length > 0) {
    opportunities.push({
      category: categoryData[0].name,
      type: "strength",
      message: `${categoryData[0].name} is your strongest category. Protect it.`,
    });
    if (categoryData.length > 1) {
      opportunities.push({
        category: categoryData[categoryData.length - 1].name,
        type: "growth",
        message: `${categoryData[categoryData.length - 1].name} has room to grow.`,
      });
    }
  }

  return (
    <div className="space-y-3">
      {opportunities.map((opp, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-gray-200 bg-gray-50"
        >
          <span className="text-gray-900">{opp.message}</span>
        </div>
      ))}
    </div>
  );
}
