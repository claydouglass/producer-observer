// Calculate rank history for a brand based on all brands' monthly data
export function calculateRankHistory(selected, allBrands) {
  if (!selected?.wholesaleByMonth || !allBrands?.length) return null;

  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate overall rank per month
  const overall = months.map(month => {
    // Get all brands' wholesale for this month
    const brandsWithData = allBrands
      .map(b => ({
        id: b.id,
        name: b.name,
        wholesale: b.wholesaleByMonth?.[month] || 0
      }))
      .filter(b => b.wholesale > 0)
      .sort((a, b) => b.wholesale - a.wholesale);

    const idx = brandsWithData.findIndex(b => b.id === selected.id);
    if (idx === -1) return null;

    return {
      month,
      rank: idx + 1,
      wholesale: Math.round(selected.wholesaleByMonth[month] || 0)
    };
  }).filter(Boolean);

  if (overall.length === 0) return null;

  // Calculate category ranks per month
  const categories = Object.keys(selected.wholesaleByCategory || {});
  const byCategory = {};

  categories.forEach(category => {
    const categoryRanks = months.map(month => {
      // Estimate category wholesale for this month based on overall ratio
      const totalWholesale = selected.wholesale || 1;
      const categoryWholesale = selected.wholesaleByCategory?.[category] || 0;
      const ratio = categoryWholesale / totalWholesale;
      const monthlyCategory = (selected.wholesaleByMonth?.[month] || 0) * ratio;

      if (monthlyCategory === 0) return null;

      // Rank against other brands in this category
      const brandsInCategory = allBrands
        .filter(b => b.wholesaleByCategory?.[category] > 0)
        .map(b => {
          const bTotal = b.wholesale || 1;
          const bCatWholesale = b.wholesaleByCategory?.[category] || 0;
          const bRatio = bCatWholesale / bTotal;
          const bMonthly = (b.wholesaleByMonth?.[month] || 0) * bRatio;
          return { id: b.id, wholesale: bMonthly };
        })
        .filter(b => b.wholesale > 0)
        .sort((a, b) => b.wholesale - a.wholesale);

      const idx = brandsInCategory.findIndex(b => b.id === selected.id);
      if (idx === -1) return null;

      return { month, rank: idx + 1 };
    }).filter(Boolean);

    if (categoryRanks.length > 0) {
      byCategory[category] = categoryRanks;
    }
  });

  return { overall, byCategory };
}
