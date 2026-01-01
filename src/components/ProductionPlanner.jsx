import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  ShieldAlert,
  Heart,
  Package,
} from "lucide-react";

// Calculate confidence based on historical demand vs planned production
function calculateConfidence(
  selected,
  category,
  strainType,
  quantityKg,
  pricePerGram,
) {
  if (!selected?.byCategory || !selected?.byMonth) {
    return { confidence: 0, message: "No data", risk: "unknown" };
  }

  const categoryRevenue = selected.byCategory[category] || 0;
  const monthlyDemand = categoryRevenue / 8;
  const sixMonthDemand = monthlyDemand * 6;

  const avgPricePerGram = 8;
  const monthlyGrams = (monthlyDemand / avgPricePerGram) * 1000;
  const sixMonthGrams = monthlyGrams * 6;
  const plannedGrams = quantityKg * 1000;
  const sellThroughRatio = sixMonthGrams / plannedGrams;

  const priceScore =
    pricePerGram <= 2
      ? 1
      : pricePerGram <= 3
        ? 0.9
        : pricePerGram <= 4
          ? 0.7
          : 0.5;

  const months = Object.values(selected.byMonth);
  const recentAvg = months.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const olderAvg = months.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const trendFactor =
    recentAvg > olderAvg ? 1.1 : recentAvg < olderAvg * 0.8 ? 0.8 : 1;

  let baseConfidence = Math.min(sellThroughRatio, 1) * 100;
  let confidence = Math.round(baseConfidence * priceScore * trendFactor);
  confidence = Math.min(99, Math.max(5, confidence));

  let risk =
    confidence >= 85
      ? "low"
      : confidence >= 65
        ? "medium"
        : confidence >= 40
          ? "elevated"
          : "high";
  let message =
    confidence >= 85
      ? "Strong demand. High likelihood of sell-through."
      : confidence >= 65
        ? "Good demand. Consider slightly lower quantity or price."
        : confidence >= 40
          ? "Moderate demand. Reduce quantity or lower price."
          : "Low demand signal. Reconsider this production run.";

  const projectedRevenue = Math.round(
    plannedGrams * pricePerGram * (confidence / 100),
  );

  return {
    confidence,
    risk,
    message,
    projectedRevenue,
    sixMonthDemand: Math.round(sixMonthDemand),
    plannedGrams,
  };
}

// Calculate out-of-stock impact
function calculateOOSImpact(selected) {
  if (!selected) return { weeklyLoss: 0, monthlyLoss: 0, customersAtRisk: 0 };
  const weeklyRevenue = selected.revenue / 32; // 8 months = ~32 weeks
  const weeklyLoss = Math.round(weeklyRevenue);
  const customersAtRisk = Math.round(selected.customers * 0.15); // 15% at risk per stockout
  return { weeklyLoss, monthlyLoss: weeklyLoss * 4, customersAtRisk };
}

// Brand erosion: triggered when < 4 products per segment on shelf
// From retailer strategy: "EROSION PREVENTION: Maintaining minimum 4 products per segment"
const EROSION_THRESHOLD = 4; // products per segment - will pull from POS data

function calculateErosion(selected, category, strainType) {
  if (!selected)
    return {
      risk: "low",
      productsOnShelf: 0,
      threshold: EROSION_THRESHOLD,
      customersLost: 0,
    };

  // Products on shelf per segment (will come from POS/inventory data)
  // For demo, simulate based on category presence
  const categoryRevenue = selected.byCategory?.[category] || 0;
  const hasPresence = categoryRevenue > 500;

  // Simulate products on shelf - real data would come from retailer POS
  const simulatedProducts = hasPresence
    ? Math.round(Math.random() * 5 + 1) // 1-6 products
    : 0;
  const productsOnShelf = simulatedProducts;

  const isLow = productsOnShelf < EROSION_THRESHOLD;
  const gap = Math.max(0, EROSION_THRESHOLD - productsOnShelf);

  // Erosion rate: 5% customer loss per missing product
  const erosionRate = isLow ? Math.min(gap * 0.05, 0.2) : 0;
  const customersLost = Math.round(selected.customers * erosionRate);

  let risk =
    productsOnShelf === 0
      ? "critical"
      : productsOnShelf < EROSION_THRESHOLD
        ? "high"
        : productsOnShelf < EROSION_THRESHOLD + 2
          ? "watch"
          : "healthy";

  return {
    risk,
    productsOnShelf,
    threshold: EROSION_THRESHOLD,
    customersLost,
    gap,
  };
}

// Relationship score based on consistency
function calculateRelationship(selected) {
  if (!selected?.byMonth) return { score: 0, status: "unknown" };
  const months = Object.values(selected.byMonth);
  const avgMonthly = selected.revenue / 8;
  const variance =
    months.reduce((sum, m) => sum + Math.abs(m - avgMonthly), 0) /
    months.length;
  const consistency = Math.max(0, 100 - (variance / avgMonthly) * 100);
  const score = Math.round(
    Math.min(100, consistency + (selected.transactions > 500 ? 10 : 0)),
  );
  const status =
    score >= 80
      ? "Strong"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Needs work"
          : "At risk";
  return { score, status };
}

export default function ProductionPlanner({ selected }) {
  const [category, setCategory] = useState("Flower");
  const [strainType, setStrainType] = useState("Indica");
  const [strain, setStrain] = useState("");
  const [quantityKg, setQuantityKg] = useState(20);
  const [pricePerGram, setPricePerGram] = useState(2.5);

  const categories = Object.keys(selected?.byCategory || { Flower: 0 });
  const types = ["Indica", "Hybrid", "Sativa"];

  const result = useMemo(
    () =>
      calculateConfidence(
        selected,
        category,
        strainType,
        quantityKg,
        pricePerGram,
      ),
    [selected, category, strainType, quantityKg, pricePerGram],
  );
  const oosImpact = useMemo(() => calculateOOSImpact(selected), [selected]);
  const erosion = useMemo(
    () => calculateErosion(selected, category, strainType),
    [selected, category, strainType],
  );
  const relationship = useMemo(
    () => calculateRelationship(selected),
    [selected],
  );

  const confidenceColor =
    result.confidence >= 85
      ? "text-green-600"
      : result.confidence >= 65
        ? "text-amber-600"
        : result.confidence >= 40
          ? "text-orange-600"
          : "text-red-600";
  const confidenceBg =
    result.confidence >= 85
      ? "bg-green-50 border-green-200"
      : result.confidence >= 65
        ? "bg-amber-50 border-amber-200"
        : result.confidence >= 40
          ? "bg-orange-50 border-orange-200"
          : "bg-red-50 border-red-200";

  return (
    <div className="space-y-6">
      {/* Main Planner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              Production Planner
            </div>
            <div className="text-sm text-gray-500">
              Plan what to produce, how much, at what price
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Zap size={12} />
            Live data
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <div className="flex gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setStrainType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${strainType === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Strain (optional)
              </label>
              <input
                type="text"
                value={strain}
                onChange={(e) => setStrain(e.target.value)}
                placeholder="e.g. Blue Dream"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Quantity (kg)
              </label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                min={1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Wholesale price ($/gram)
              </label>
              <input
                type="number"
                value={pricePerGram}
                onChange={(e) => setPricePerGram(Number(e.target.value))}
                step={0.25}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Result */}
          <div>
            <div className={`rounded-xl border-2 p-6 ${confidenceBg}`}>
              <div className="flex items-center justify-between mb-4">
                {result.confidence >= 65 ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <AlertTriangle className="text-amber-500" size={24} />
                )}
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase">
                    Sell-through Confidence
                  </div>
                  <div className={`text-4xl font-bold ${confidenceColor}`}>
                    {result.confidence}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-4">{result.message}</div>
              <div className="space-y-2 pt-4 border-t border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">6-month demand</span>
                  <span className="font-medium">
                    ${result.sixMonthDemand.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Your production value</span>
                  <span className="font-medium">
                    ${(quantityKg * 1000 * pricePerGram).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Projected sell-through</span>
                  <span className="font-semibold text-green-600">
                    ${result.projectedRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-3 gap-4">
        {/* Out of Stock Impact */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-700">
              Out of Stock Impact
            </span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">
            ${oosImpact.weeklyLoss.toLocaleString()}/week
          </div>
          <div className="text-sm text-gray-500 mb-3">
            Lost revenue when empty
          </div>
          <div className="text-xs text-red-600 bg-red-50 rounded-lg p-2">
            {oosImpact.customersAtRisk} customers may switch brands
          </div>
        </div>

        {/* Brand Erosion */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={16} className="text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">
              Products on Shelf
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            {category} / {strainType}
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className={`text-3xl font-bold ${erosion.productsOnShelf < erosion.threshold ? "text-red-600" : "text-green-600"}`}
            >
              {erosion.productsOnShelf}
            </span>
            <span className="text-sm text-gray-400">
              / {erosion.threshold} min
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-3">
            {erosion.risk === "critical"
              ? "No products - erosion happening"
              : erosion.risk === "high"
                ? `Need ${erosion.gap} more products`
                : erosion.risk === "watch"
                  ? "Getting thin - add variety"
                  : "Good variety on shelf"}
          </div>
          {erosion.productsOnShelf < erosion.threshold && (
            <div className="text-xs text-red-600 bg-red-50 rounded-lg p-2">
              ~{erosion.customersLost} customers may switch brands
            </div>
          )}
        </div>

        {/* Relationship Score */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-pink-500" />
            <span className="text-sm font-semibold text-gray-700">
              Retailer Relationship
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {relationship.score}/100
          </div>
          <div className="text-sm text-gray-500 mb-3">
            {relationship.status}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${relationship.score >= 80 ? "bg-green-500" : relationship.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${relationship.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Consumer Insights */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={18} className="text-violet-600" />
          <span className="font-semibold text-gray-900">Consumer Insights</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Customer Profile
            </div>
            <div className="text-sm text-gray-600">
              Your customers spend <strong>2x more</strong> than average and buy
              from <strong>8+ brands</strong>. They're explorers.
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-1">
              What They Love
            </div>
            <div className="text-sm text-gray-600">
              {category === "Flower"
                ? "Quality flower, mid-to-premium pricing. Value consistency."
                : category === "Pre-Roll"
                  ? "Convenience, variety packs, gift-ready options."
                  : category === "Cartridges"
                    ? "Live resin preferred. Brand loyalty is high."
                    : "Quality products with clear dosing."}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Retailer Type
            </div>
            <div className="text-sm text-gray-600">
              Boutique dispensary focused on <strong>local craft</strong>{" "}
              producers. Customers trust their curation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
