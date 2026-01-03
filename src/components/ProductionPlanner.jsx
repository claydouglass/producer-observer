import React, { useState, useMemo } from "react";
import { CheckCircle, AlertTriangle, Zap } from "lucide-react";

// Unit conversions
const GRAMS_PER_OZ = 28.35;
const GRAMS_PER_LB = 453.6;

function gramsToImperial(grams) {
  if (grams >= GRAMS_PER_LB) {
    const lbs = grams / GRAMS_PER_LB;
    return `${lbs.toFixed(1)} lbs`;
  }
  const oz = grams / GRAMS_PER_OZ;
  return `${oz.toFixed(1)} oz`;
}

function formatGrams(grams) {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${grams}g`;
}

// Calculate confidence based on demand vs planned production
function calculateConfidence(
  selected,
  category,
  strainType,
  grams,
  pricePerGram,
) {
  if (!selected?.wholesaleByCategory) {
    return { confidence: 0, demandGrams: 0, message: "No data" };
  }

  // Get wholesale demand for this category
  const categoryWholesale = selected.wholesaleByCategory?.[category] || 0;
  const monthlyWholesale = categoryWholesale / 8;
  const sixMonthWholesale = monthlyWholesale * 6;

  // Estimate grams from wholesale (rough: $2-4/gram wholesale average)
  const avgWholesalePerGram = 3;
  const demandGrams = Math.round(sixMonthWholesale / avgWholesalePerGram);

  // How much of demand does this production cover?
  const coverageRatio = grams / (demandGrams || 1);

  // Confidence: 99% if you're producing less than demand, drops as you exceed
  let confidence;
  if (coverageRatio <= 0.5) {
    confidence = 99; // Well under demand
  } else if (coverageRatio <= 1) {
    confidence = 99 - Math.round((coverageRatio - 0.5) * 20); // 99% -> 89%
  } else if (coverageRatio <= 2) {
    confidence = 89 - Math.round((coverageRatio - 1) * 40); // 89% -> 49%
  } else {
    confidence = Math.max(10, 49 - Math.round((coverageRatio - 2) * 20));
  }

  const projectedWholesale = Math.round(
    grams * pricePerGram * (confidence / 100),
  );

  let message;
  if (confidence >= 90) message = "Strong demand. This will sell.";
  else if (confidence >= 70) message = "Good demand. Should sell through.";
  else if (confidence >= 50)
    message = "Moderate demand. Consider reducing quantity.";
  else message = "Low demand for this amount. Reduce or reconsider.";

  return { confidence, demandGrams, projectedWholesale, message };
}

export default function ProductionPlanner({ selected }) {
  const [category, setCategory] = useState("Flower");
  const [strainType, setStrainType] = useState("Indica");
  const [grams, setGrams] = useState(5000); // Start with 5kg
  const [pricePerGram, setPricePerGram] = useState(2.5);

  const categories = Object.keys(
    selected?.wholesaleByCategory || { Flower: 0 },
  );
  const types = ["Indica", "Hybrid", "Sativa"];

  const result = useMemo(
    () =>
      calculateConfidence(selected, category, strainType, grams, pricePerGram),
    [selected, category, strainType, grams, pricePerGram],
  );

  const confidenceColor =
    result.confidence >= 80
      ? "text-green-600"
      : result.confidence >= 60
        ? "text-amber-600"
        : "text-red-600";
  const confidenceBg =
    result.confidence >= 80
      ? "bg-green-50 border-green-200"
      : result.confidence >= 60
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200";

  // Quick quantity presets (in grams)
  const presets = [
    { label: "1 lb", grams: 454 },
    { label: "5 lbs", grams: 2270 },
    { label: "10 lbs", grams: 4540 },
    { label: "25 lbs", grams: 11340 },
    { label: "50 lbs", grams: 22680 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              Production Planner
            </div>
            <div className="text-sm text-gray-500">
              If I grow this, will it sell here?
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Zap size={12} />
            Based on real demand
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            {/* Category */}
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

            {/* Type */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <div className="flex gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setStrainType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      strainType === t
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity - grams with imperial display */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Quantity <span className="text-gray-400">(grams)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value))}
                  min={1}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 min-w-[80px] text-center">
                  {gramsToImperial(grams)}
                </div>
              </div>
              {/* Quick presets */}
              <div className="flex gap-1 mt-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setGrams(p.grams)}
                    className={`px-2 py-1 text-xs rounded ${
                      grams === p.grams
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price per gram */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Price ($/gram)
              </label>
              <input
                type="number"
                value={pricePerGram}
                onChange={(e) => setPricePerGram(Number(e.target.value))}
                step={0.25}
                min={0.5}
                max={10}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Result */}
          <div className={`rounded-xl border-2 p-6 ${confidenceBg}`}>
            <div className="flex items-center justify-between mb-4">
              {result.confidence >= 70 ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <AlertTriangle className="text-amber-500" size={24} />
              )}
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase">
                  Sell-through
                </div>
                <div className={`text-4xl font-bold ${confidenceColor}`}>
                  {result.confidence}%
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-4">{result.message}</div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              {/* Your production */}
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Your production
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatGrams(grams)}
                  </span>
                  <span className="text-gray-500">
                    ({gramsToImperial(grams)})
                  </span>
                </div>
              </div>

              {/* 6-month demand */}
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  6-month demand at this store
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatGrams(result.demandGrams)}
                  </span>
                  <span className="text-gray-500">
                    ({gramsToImperial(result.demandGrams)})
                  </span>
                </div>
              </div>

              {/* Wholesale value */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Production value
                  </span>
                  <span className="font-medium">
                    ${(grams * pricePerGram).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Projected sales</span>
                  <span className="font-bold text-green-600">
                    ${result.projectedWholesale.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple explanation of brand erosion */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
          <div>
            <div className="font-medium text-amber-900">
              Why consistent supply matters
            </div>
            <div className="text-sm text-amber-800 mt-1">
              When your products drop below 4 SKUs on shelf, customers switch to
              other brands. This is called <strong>brand erosion</strong>. Keep
              variety up = keep your customers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
