export const gapData = [
  { name: 'Gummies', market: 47331, priority: 'critical' },
  { name: '510 Thread LR Cartridges', market: 47304, priority: 'critical' },
  { name: 'Flower 1oz Deal', market: 13910, priority: 'high' },
  { name: '10-Pack Pre-Rolls', market: 12258, priority: 'medium' },
];

export const totalOpportunity = gapData.reduce((sum, g) => sum + g.market, 0);
export const criticalGapsCount = gapData.filter(g => g.priority === 'critical').length;
