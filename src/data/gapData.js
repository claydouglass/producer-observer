// Wholesale values (what producers earn from retailer)
// Original retail values converted at ~45% wholesale margin
export const gapData = [
  { name: "Gummies", market: 21299, priority: "critical" }, // was 47331 retail
  { name: "510 Thread LR Cartridges", market: 21287, priority: "critical" }, // was 47304 retail
  { name: "Flower 1oz Deal", market: 6260, priority: "high" }, // was 13910 retail
  { name: "10-Pack Pre-Rolls", market: 5516, priority: "medium" }, // was 12258 retail
];

export const totalOpportunity = gapData.reduce((sum, g) => sum + g.market, 0);
export const criticalGapsCount = gapData.filter(
  (g) => g.priority === "critical",
).length;
