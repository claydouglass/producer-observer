import React from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  ShieldAlert,
  Zap,
  Star,
  BarChart3,
} from "lucide-react";

export default function PartnershipSection({ selected }) {
  const wholesale = selected.wholesale || 0;
  const strategies = [];

  // Get real data
  const categories = selected.wholesaleByCategory || {};
  const categoryNames = Object.keys(categories);
  const monthlyData = selected.wholesaleByMonth || {};
  const monthValues = Object.values(monthlyData);
  const typeData = selected.wholesaleByType || {};

  // Products data for performance analysis
  const products = selected.products || [];

  // Calculate trend metrics
  const peak = Math.max(...monthValues);
  const peakMonth = Object.keys(monthlyData)[monthValues.indexOf(peak)];
  const recentMonths = monthValues.slice(-3);
  const recentAvg =
    recentMonths.reduce((a, b) => a + b, 0) / recentMonths.length;
  const declineFromPeak =
    peak > 0 ? Math.round(((peak - recentAvg) / peak) * 100) : 0;
  const isEroding = declineFromPeak > 25;

  // Customer metrics
  const customers = selected.customers || 0;
  const transactions = selected.transactions || 0;
  const transactionsPerCustomer = customers > 0 ? transactions / customers : 0;

  // Monthly volatility
  const monthlyVolatility =
    monthValues.length > 1
      ? Math.round(
          ((Math.max(...monthValues) - Math.min(...monthValues)) /
            Math.max(...monthValues)) *
            100,
        )
      : 0;

  // === ANALYZE CATEGORY PERFORMANCE ===
  const categoryPerformance = Object.entries(categories)
    .map(([name, revenue]) => {
      // Find products in this category
      const categoryProducts = products.filter((p) => p.category === name);
      const categoryUnits = categoryProducts.reduce(
        (sum, p) => sum + (p.units || 0),
        0,
      );
      const avgPrice = categoryUnits > 0 ? revenue / categoryUnits : 0;
      const productCount = categoryProducts.length;

      // Revenue per product (efficiency)
      const revenuePerProduct =
        productCount > 0 ? revenue / productCount : revenue;

      return {
        name,
        revenue,
        units: categoryUnits,
        avgPrice,
        productCount,
        revenuePerProduct,
        pct: Math.round((revenue / wholesale) * 100),
      };
    })
    .sort((a, b) => b.revenuePerProduct - a.revenuePerProduct);

  // === ANALYZE TYPE/STRAIN PERFORMANCE ===
  // Consolidate types to Indica/Hybrid/Sativa
  const consolidatedTypes = { Indica: 0, Hybrid: 0, Sativa: 0 };
  Object.entries(typeData).forEach(([type, value]) => {
    if (type.toLowerCase().includes("indica"))
      consolidatedTypes.Indica += value;
    else if (type.toLowerCase().includes("sativa"))
      consolidatedTypes.Sativa += value;
    else consolidatedTypes.Hybrid += value;
  });

  const typePerformance = Object.entries(consolidatedTypes)
    .filter(([_, v]) => v > 0)
    .map(([name, revenue]) => ({
      name,
      revenue,
      pct: Math.round((revenue / wholesale) * 100),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // === ANALYZE PRODUCT PERFORMANCE ===
  const topProducts = products.slice(0, 5);
  const bottomProducts = products.slice(-5).reverse();

  // Find best performing products by revenue/unit ratio
  const productsWithEfficiency = products
    .filter((p) => p.units > 0)
    .map((p) => ({
      ...p,
      efficiency: p.wholesale / p.units,
      revenueShare: (p.wholesale / wholesale) * 100,
    }))
    .sort((a, b) => b.efficiency - a.efficiency);

  const highEfficiencyProducts = productsWithEfficiency.slice(0, 3);
  const lowEfficiencyProducts = productsWithEfficiency.slice(-3).reverse();

  // === BUILD STRATEGIES FROM DATA ===

  // STRATEGY 1: Brand Erosion
  if (isEroding) {
    const lostRevenue = Math.round((peak - recentAvg) * 12);
    strategies.push({
      icon: ShieldAlert,
      priority: 1,
      color: "red",
      title: "Stop revenue decline",
      detail: `Down ${declineFromPeak}% from ${peakMonth} peak. $${Math.round(peak).toLocaleString()}/mo → $${Math.round(recentAvg).toLocaleString()}/mo.`,
      impact: `Recover $${Math.round(lostRevenue / 1000)}K/year`,
      impactValue: lostRevenue,
      actions: [
        "Check stock levels on top sellers during decline",
        "Review if any products were discontinued",
        "Audit shelf placement changes",
      ],
    });
  }

  // STRATEGY 2: Supply consistency
  if (monthlyVolatility > 40) {
    const stabilizedRevenue = Math.round(recentAvg * 0.2 * 12);
    strategies.push({
      icon: AlertTriangle,
      priority: isEroding ? 2 : 1,
      color: "amber",
      title: "Stabilize supply",
      detail: `${monthlyVolatility}% monthly swing. Peak of $${Math.round(peak).toLocaleString()} proves demand exists when stocked.`,
      impact: `+$${Math.round(stabilizedRevenue / 1000)}K/year`,
      impactValue: stabilizedRevenue,
      actions: [
        "Maintain minimum stock on top 5 SKUs",
        "Align delivery schedule with sell-through",
        "Track weekly velocity to predict needs",
      ],
    });
  }

  // STRATEGY 3: Double down on winning category
  if (categoryPerformance.length > 0) {
    const bestCategory = categoryPerformance[0];
    const worstCategory = categoryPerformance[categoryPerformance.length - 1];

    if (
      bestCategory.revenuePerProduct >
      worstCategory.revenuePerProduct * 1.5
    ) {
      const shiftRevenue = Math.round(worstCategory.revenue * 0.3); // Reallocate 30%
      strategies.push({
        icon: BarChart3,
        priority: 3,
        color: "green",
        title: `Shift focus to ${bestCategory.name}`,
        detail: `${bestCategory.name} earns $${Math.round(bestCategory.revenuePerProduct).toLocaleString()}/SKU vs $${Math.round(worstCategory.revenuePerProduct).toLocaleString()} for ${worstCategory.name}.`,
        impact: `+$${Math.round(shiftRevenue / 1000)}K by optimizing mix`,
        impactValue: shiftRevenue,
        actions: [
          `Add 2-3 more ${bestCategory.name} SKUs`,
          `Review if ${worstCategory.name} SKUs are worth shelf space`,
          "Request better placement for top category",
        ],
      });
    }
  }

  // STRATEGY 4: Optimize strain mix
  if (typePerformance.length > 1) {
    const topType = typePerformance[0];
    const otherTypes = typePerformance.slice(1);
    const underperformer = otherTypes.find((t) => t.pct < 15);

    if (topType.pct > 40 && underperformer) {
      const typeShiftRevenue = Math.round(topType.revenue * 0.15);
      strategies.push({
        icon: Target,
        priority: 4,
        color: "blue",
        title: `Expand ${topType.name} lineup`,
        detail: `${topType.name} is ${topType.pct}% of revenue. ${underperformer.name} only ${underperformer.pct}%. Your customers prefer ${topType.name}.`,
        impact: `+$${Math.round(typeShiftRevenue / 1000)}K from strain optimization`,
        impactValue: typeShiftRevenue,
        actions: [
          `Add more ${topType.name}-dominant strains`,
          `Test phasing out low-performing ${underperformer.name} SKUs`,
          "Match strain mix to customer preference",
        ],
      });
    }
  }

  // STRATEGY 5: Product efficiency - do more of what works
  if (highEfficiencyProducts.length > 0 && lowEfficiencyProducts.length > 0) {
    const bestProduct = highEfficiencyProducts[0];
    const worstProduct = lowEfficiencyProducts[0];

    if (bestProduct.efficiency > worstProduct.efficiency * 2) {
      const efficiencyGain = Math.round(worstProduct.wholesale * 0.5);
      strategies.push({
        icon: Star,
        priority: 5,
        color: "purple",
        title: "Optimize product mix",
        detail: `"${bestProduct.name.split("|")[0].trim()}" earns $${bestProduct.efficiency.toFixed(0)}/unit vs $${worstProduct.efficiency.toFixed(0)} for "${worstProduct.name.split("|")[0].trim()}".`,
        impact: `+$${Math.round(efficiencyGain / 1000)}K by focusing on winners`,
        impactValue: efficiencyGain,
        actions: [
          "Increase stock depth on high-efficiency products",
          "Consider discontinuing lowest performers",
          "Use learnings to inform new product development",
        ],
      });
    }
  }

  // STRATEGY 6: Improve customer loyalty through consistency
  if (transactionsPerCustomer < 5) {
    const loyaltyRevenue = Math.round(
      customers * 0.2 * (wholesale / transactions) * 2,
    ); // 20% more repeat visits
    strategies.push({
      icon: Users,
      priority: 6,
      color: "green",
      title: "Build repeat purchases",
      detail: `${transactionsPerCustomer.toFixed(1)} transactions per customer. Consistent quality + availability drives loyalty.`,
      impact: `+$${Math.round(loyaltyRevenue / 1000)}K from increased loyalty`,
      impactValue: loyaltyRevenue,
      actions: [
        "Never stock out on customer favorites",
        "Maintain consistent quality batch to batch",
        "Price fairly - value builds trust",
      ],
    });
  }

  // Sort by priority
  strategies.sort((a, b) => a.priority - b.priority);
  const totalPotential = strategies.reduce(
    (sum, s) => sum + (s.impactValue || 0),
    0,
  );
  const targetRevenue = wholesale + totalPotential;

  const colorClasses = {
    red: "bg-red-50 border-red-200",
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    green: "bg-green-50 border-green-200",
  };

  const iconColorClasses = {
    red: "text-red-600 bg-red-100",
    amber: "text-amber-600 bg-amber-100",
    blue: "text-blue-600 bg-blue-100",
    purple: "text-purple-600 bg-purple-100",
    green: "text-green-600 bg-green-100",
  };

  return (
    <div className="space-y-6">
      {/* Playbook */}
      <div className="p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-900">
            Growth Playbook
          </div>
          <div className="text-xs text-gray-500">
            Analyzed from your sales data
          </div>
        </div>

        <div className="space-y-4">
          {strategies.slice(0, 4).map((s, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${colorClasses[s.color]}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColorClasses[s.color]}`}
                >
                  <s.icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">
                        #{i + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {s.title}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">
                      {s.impact}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{s.detail}</div>

                  <div className="mt-3 space-y-1">
                    {s.actions.map((action, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <Zap
                          size={10}
                          className="text-gray-400 flex-shrink-0"
                        />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {strategies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp size={24} className="mx-auto mb-2 text-green-500" />
            <div className="font-medium text-gray-900">Strong performance</div>
            <div className="text-sm">
              Keep maintaining quality and consistency
            </div>
          </div>
        )}
      </div>

      {/* Target */}
      {strategies.length > 0 && (
        <div
          className={`p-6 rounded-xl ${isEroding ? "bg-gradient-to-r from-amber-600 to-orange-600" : "bg-gradient-to-r from-indigo-600 to-violet-600"} text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80 mb-1">
                {isEroding ? "Recovery target" : "12-month target"}
              </div>
              <div className="text-3xl font-bold">
                ${Math.round(targetRevenue / 1000)}K
              </div>
              <div className="text-sm opacity-80 mt-1">
                +${Math.round(totalPotential / 1000)}K potential
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="opacity-80">Current</div>
              <div className="text-xl font-semibold">
                ${Math.round(wholesale / 1000)}K
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
