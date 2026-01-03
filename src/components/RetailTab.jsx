import React, { useState, useMemo } from "react";
import QuestionCard from "./QuestionCard";
import KPICard from "./KPICard";
import ForecastChart from "./ForecastChart";
import RankHistory from "./RankHistory";
import CompetitorRanking from "./CompetitorRanking";
import ProductSection from "./report/ProductSection";
import WeeklySection from "./report/WeeklySection";
import CategoryTypeBreakdown from "./CategoryTypeBreakdown";

import PricingTiers from "./PricingTiers";
import OpportunitySection from "./OpportunitySection";
import {
  consolidateTypes,
  getTimeframeMonths,
  calculateTrend,
  generateRankings,
  sumByDateRange,
  getCategoryByDateRange,
  getProductsByDateRange,
} from "../utils/rankings";
import { calculateRankHistory } from "../utils/calculateRankHistory";

export default function RetailTab({ selected, brands = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [timeframe, setTimeframe] = useState("all");
  const storeName = "Miracle Greens";

  if (!selected) return null;

  const monthlyData = selected.wholesaleByMonth || {};
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyValues = months.map((m) => ({
    month: m,
    value: monthlyData[m] || 0,
  }));
  const peakMonth = monthlyValues.reduce(
    (max, m) => (m.value > max.value ? m : max),
    monthlyValues[0],
  );
  const dropFromPeak =
    peakMonth.value > 0
      ? Math.round((1 - monthlyValues[7].value / peakMonth.value) * 100)
      : 0;

  // Use exact date-based totals
  const timeframeTotals = useMemo(() => {
    return sumByDateRange(selected.byDate, timeframe);
  }, [selected, timeframe]);

  const timeframeWholesale = timeframeTotals.wholesale;
  const timeframeUnits = timeframeTotals.units;

  const ranking = useMemo(
    () =>
      generateRankings(
        selected,
        brands,
        selectedCategory,
        selectedType,
        timeframe,
      ),
    [selected, brands, selectedCategory, selectedType, timeframe],
  );

  // Calculate rank history if not already present
  const rankHistory = useMemo(
    () => selected.rankHistory || calculateRankHistory(selected, brands),
    [selected, brands],
  );
  const selectedWithRankHistory = { ...selected, rankHistory };

  // Get exact category data for answer
  const categoryByTimeframe = useMemo(
    () => getCategoryByDateRange(selected.categoryByDate, timeframe),
    [selected, timeframe],
  );

  const categoryData = Object.entries(categoryByTimeframe)
    .map(([name, data]) => ({
      name,
      wholesale: Math.round(data.wholesale),
      pct: Math.round((data.wholesale / (timeframeWholesale || 1)) * 100),
    }))
    .sort((a, b) => b.wholesale - a.wholesale);

  // Get exact product data for answer
  const timeframeProducts = useMemo(
    () => getProductsByDateRange(selected.products, timeframe),
    [selected, timeframe],
  );

  // Timeframe label for display
  const timeframeLabel =
    timeframe === "30d" ? "Dec" : timeframe === "90d" ? "Q4" : "All Time";

  const kpis = [
    {
      label: "Rank",
      value: `#${ranking?.rank || selected.rank}`,
      sub: `of ${ranking?.total || brands.length} in ${timeframeLabel}`,
    },
    {
      label: "Revenue",
      value: `$${Math.round(timeframeWholesale).toLocaleString()}`,
      sub: timeframeLabel,
    },
    {
      label: "Units",
      value: timeframeUnits.toLocaleString(),
      sub: timeframeLabel,
    },
    {
      label: "Products",
      value: timeframeProducts.length.toLocaleString(),
      sub: timeframeLabel,
    },
  ];

  const rankAnswer = `#${ranking?.rank || selected.rank} of ${ranking?.total || brands.length} brands in ${timeframeLabel}.`;
  const trendAnswer =
    dropFromPeak > 10
      ? `Down ${dropFromPeak}% from ${peakMonth.month} peak.`
      : `$${timeframeWholesale.toLocaleString()} revenue.`;
  const competitorAnswer =
    ranking?.above.length > 0
      ? `${ranking.above.map((b) => b.name).join(", ")} ahead.`
      : "You're #1!";
  const sellingAnswer = categoryData[0]
    ? `${categoryData[0].name} is ${categoryData[0].pct}% at $${categoryData[0].wholesale.toLocaleString()}.`
    : null;

  return (
    <div className="space-y-6">
      <QuestionCard question="Am I going up or down?" answer={trendAnswer}>
        <ForecastChart
          selected={selected}
          categoryFilter={selectedCategory}
          setCategoryFilter={setSelectedCategory}
          typeFilter={selectedType}
          setTypeFilter={setSelectedType}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      </QuestionCard>

      <QuestionCard
        question={`How am I doing at ${storeName}?`}
        answer={rankAnswer}
      >
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <KPICard key={i} {...kpi} />
          ))}
        </div>
      </QuestionCard>

      <QuestionCard question="Who's beating me?" answer={competitorAnswer}>
        <CompetitorRanking ranking={ranking} selected={selected} />
      </QuestionCard>

      <QuestionCard question="How's my rank changing over time?">
        <RankHistory selected={selectedWithRankHistory} />
      </QuestionCard>

      <QuestionCard question="What's selling?" answer={sellingAnswer}>
        <CategoryTypeBreakdown selected={selected} timeframe={timeframe} />
      </QuestionCard>

      <QuestionCard
        question="Which products are winning?"
        answer={
          timeframeProducts[0]
            ? `${timeframeProducts[0].name.split("|")[0].trim()} tops at $${timeframeProducts[0].wholesale.toLocaleString()}.`
            : null
        }
      >
        <ProductSection selected={selected} timeframe={timeframe} />
      </QuestionCard>

      <QuestionCard
        question="Is my pricing right?"
        answer="Check your tier distribution vs market."
        defaultExpanded={false}
      >
        <PricingTiers products={timeframeProducts} />
      </QuestionCard>

      <QuestionCard
        question="When do I sell most?"
        answer="87% swing week to week."
        defaultExpanded={false}
      >
        <WeeklySection selected={selected} />
      </QuestionCard>

      <QuestionCard
        question="What's the opportunity here?"
        defaultExpanded={false}
      >
        <OpportunitySection selected={selected} />
      </QuestionCard>

      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          Want to see all your stores?
        </h3>
        <p className="text-gray-600 mb-4">
          Tell us which retailers you work with. We'll invite them to share
          data.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add my stores →
        </button>
      </div>
    </div>
  );
}
