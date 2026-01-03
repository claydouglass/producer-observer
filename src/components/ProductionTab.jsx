import React, { useState, useMemo } from "react";
import QuestionCard from "./QuestionCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Lock,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  sumByDateRange,
  getCategoryByDateRange,
  getTypeByDateRange,
  getProductsByDateRange,
  getDateRange,
} from "../utils/rankings";

// Consolidate species to 3 types
function consolidateSpecies(species) {
  if (!species) return "Unknown";
  const s = species.toLowerCase();
  if (s.includes("indica")) return "Indica";
  if (s.includes("sativa")) return "Sativa";
  if (s.includes("hybrid") || s.includes("50/50") || s.includes("50-50"))
    return "Hybrid";
  return "Unknown";
}

// Get unit label and convert units by category
// Flower units are in grams, others are counts
function formatUnits(units, category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("flower")) {
    // Convert grams to lbs (1 lb = 453.6g)
    const lbs = units / 453.6;
    if (lbs >= 1) {
      return { value: Math.round(lbs * 10) / 10, label: "lbs" };
    }
    return { value: Math.round(units), label: "g" };
  }
  if (cat.includes("concentrate")) {
    return { value: Math.round(units), label: "g" };
  }
  return { value: Math.round(units), label: "units" };
}

// Calculate growth rate between two periods
function calculateGrowth(current, previous) {
  if (!previous || previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function ProductionTab({ selected, brands = [] }) {
  const [viewMode, setViewMode] = useState("cash"); // cash or units
  const [timeframe] = useState("90d");

  if (!selected) return null;

  // Get timeframe data
  const currentTotals = useMemo(
    () => sumByDateRange(selected.byDate, "30d"),
    [selected],
  );
  const previousTotals = useMemo(
    () => sumByDateRange(selected.byDate, "90d"),
    [selected],
  );

  // Get category data for timeframe
  const categoryData = useMemo(() => {
    const data = getCategoryByDateRange(selected.categoryByDate, "90d");
    const prev = getCategoryByDateRange(selected.categoryByDate, "all");

    return Object.entries(data)
      .map(([name, d]) => {
        const prevVal = prev[name]?.wholesale || 0;
        const growth = calculateGrowth(d.wholesale, prevVal * 0.375); // Q4 vs normalized all-time
        return {
          name,
          wholesale: Math.round(d.wholesale),
          units: Math.round(d.units),
          growth,
        };
      })
      .sort((a, b) => b.wholesale - a.wholesale);
  }, [selected]);

  // Get type data for timeframe
  const typeData = useMemo(() => {
    const data = getTypeByDateRange(selected.typeByDate, "90d");

    // Consolidate to 3 types
    const consolidated = {
      Indica: { wholesale: 0, units: 0 },
      Sativa: { wholesale: 0, units: 0 },
      Hybrid: { wholesale: 0, units: 0 },
    };
    Object.entries(data).forEach(([type, d]) => {
      const key = consolidateSpecies(type);
      if (consolidated[key]) {
        consolidated[key].wholesale += d.wholesale;
        consolidated[key].units += d.units;
      }
    });

    const total = Object.values(consolidated).reduce(
      (s, d) => s + d.wholesale,
      0,
    );

    return Object.entries(consolidated)
      .filter(([_, d]) => d.wholesale > 0)
      .map(([name, d]) => ({
        name,
        wholesale: Math.round(d.wholesale),
        units: Math.round(d.units),
        pct: Math.round((d.wholesale / total) * 100),
      }))
      .sort((a, b) => b.wholesale - a.wholesale);
  }, [selected]);

  // Get product data with velocity
  const productData = useMemo(() => {
    const products = getProductsByDateRange(selected.products, "90d");
    return products.slice(0, 10).map((p) => ({
      ...p,
      species: consolidateSpecies(p.species),
      monthlyUnits: Math.round(p.units / 3), // Q4 = 3 months
      monthlyWholesale: Math.round(p.wholesale / 3),
    }));
  }, [selected]);

  // Forward months for forecast
  const forecastMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Build category × species matrix
  const demandMatrix = useMemo(() => {
    const products = getProductsByDateRange(selected.products, "90d");
    const matrix = {};

    products.forEach((p) => {
      const cat = p.category;
      const species = consolidateSpecies(p.species);

      // Skip Unknown species
      if (species === "Unknown") return;

      const key = `${cat}|${species}`;

      if (!matrix[key]) {
        matrix[key] = { category: cat, species, wholesale: 0, units: 0 };
      }
      matrix[key].wholesale += p.wholesale;
      matrix[key].units += p.units;
    });

    return Object.values(matrix)
      .map((d) => ({
        ...d,
        wholesale: Math.round(d.wholesale),
        units: Math.round(d.units),
        monthlyUnits: d.units / 3, // Based on Q4 average
        forecast6m: Math.round((d.wholesale / 3) * 6), // 6 month forecast based on Q4 monthly avg
        forecastUnits6m: Math.round((d.units / 3) * 6), // 6 month units forecast
      }))
      .sort((a, b) => b.units - a.units);
  }, [selected]);

  // Find top recommendation
  const topCategory = categoryData[0];
  const topType = typeData[0];
  const topMatrix = demandMatrix[0];

  // 6-month forecast (simple extrapolation from Q4)
  const forecast6m = {
    low: Math.round(currentTotals.wholesale * 5),
    high: Math.round(currentTotals.wholesale * 7),
    lowUnits: Math.round(currentTotals.units * 5),
    highUnits: Math.round(currentTotals.units * 7),
  };

  return (
    <div className="space-y-6">
      {/* Question 1: What should I produce next? */}
      <QuestionCard
        question="What should I produce next?"
        answer={
          topMatrix
            ? (() => {
                const u = formatUnits(topMatrix.units / 3, topMatrix.category);
                return `${topMatrix.category} / ${topMatrix.species}. ${u.value.toLocaleString()} ${u.label}/month demand.`;
              })()
            : null
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Based on demand at this store, here's what's selling:
          </p>

          {/* Category × Species Matrix with forward months */}
          <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Category / Type
                  </th>
                  {forecastMonths.map((m) => (
                    <th
                      key={m}
                      className="text-right px-3 py-3 font-medium text-gray-700"
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {demandMatrix.slice(0, 8).map((d, i) => {
                  const u = formatUnits(d.monthlyUnits, d.category);
                  return (
                    <tr
                      key={`${d.category}-${d.species}`}
                      className={`border-t border-gray-100 ${i === 0 ? "bg-green-50" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {d.category}
                        </span>
                        <span className="text-gray-500"> / {d.species}</span>
                        {i === 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Top
                          </span>
                        )}
                      </td>
                      {forecastMonths.map((m) => (
                        <td
                          key={m}
                          className="px-3 py-3 text-right text-blue-600 font-medium"
                        >
                          {(u.value || 0).toLocaleString()} {u.label}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </QuestionCard>

      {/* Question 2: How much demand is there? */}
      <QuestionCard
        question="How much demand is there?"
        answer={`$${forecast6m.low.toLocaleString()} - $${forecast6m.high.toLocaleString()} projected next 6 months.`}
      >
        <div className="space-y-4">
          {/* Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("cash")}
              className={`px-3 py-1 text-sm rounded-full ${
                viewMode === "cash"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewMode("units")}
              className={`px-3 py-1 text-sm rounded-full ${
                viewMode === "units"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Units
            </button>
          </div>

          {/* Forecast Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">6-Month Forecast</div>
              <div className="text-2xl font-bold text-blue-900">
                {viewMode === "cash"
                  ? `$${forecast6m.low.toLocaleString()} - $${forecast6m.high.toLocaleString()}`
                  : `${forecast6m.lowUnits.toLocaleString()} - ${forecast6m.highUnits.toLocaleString()} units`}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Last 30 Days</div>
              <div className="text-2xl font-bold text-gray-900">
                {viewMode === "cash"
                  ? `$${Math.round(currentTotals.wholesale).toLocaleString()}`
                  : `${Math.round(currentTotals.units).toLocaleString()} units`}
              </div>
            </div>
          </div>

          {/* By Category × Species */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              By Category & Type
            </div>
            <div className="space-y-2">
              {demandMatrix.slice(0, 5).map((d) => (
                <div
                  key={`${d.category}-${d.species}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">
                    {d.category} / {d.species}
                  </span>
                  <span className="text-gray-700">
                    {viewMode === "cash"
                      ? `$${(d.forecast6m || 0).toLocaleString()}`
                      : `${(d.forecastUnits6m || 0).toLocaleString()} units`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </QuestionCard>

      {/* Question 3: Which products have the most demand? */}
      <QuestionCard
        question="Which products have the most demand?"
        answer={
          productData[0]
            ? `${productData[0].name.split("|")[0].trim()}: ${productData[0].monthlyUnits} units/month.`
            : null
        }
      >
        <div className="space-y-2">
          {productData.map((p, i) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-5">
                  #{i + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {p.name.split("|")[0].trim()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.category} / {p.species}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {p.monthlyUnits} units/mo
                </div>
                <div className="text-xs text-gray-500">
                  ${p.monthlyWholesale.toLocaleString()}/mo
                </div>
              </div>
            </div>
          ))}
        </div>
      </QuestionCard>

      {/* Question 4: What categories are growing? */}
      <QuestionCard
        question="What categories are growing?"
        answer={
          topCategory
            ? `${topCategory.name} is ${topCategory.growth > 0 ? "+" : ""}${topCategory.growth}% vs last period.`
            : null
        }
      >
        <div className="space-y-3">
          {categoryData.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-900">{c.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  ${c.wholesale.toLocaleString()}
                </span>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    c.growth > 0
                      ? "text-green-600"
                      : c.growth < 0
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  {c.growth > 0 ? (
                    <TrendingUp size={14} />
                  ) : c.growth < 0 ? (
                    <TrendingDown size={14} />
                  ) : null}
                  {c.growth > 0 ? "+" : ""}
                  {c.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </QuestionCard>

      {/* Question 5: Type/strain breakdown */}
      <QuestionCard
        question="Which strains should I grow?"
        answer={
          topType
            ? `${topType.name} is ${topType.pct}% of your sales at $${topType.wholesale.toLocaleString()}.`
            : null
        }
      >
        <div className="space-y-3">
          {typeData.map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    t.name === "Indica"
                      ? "bg-purple-500"
                      : t.name === "Sativa"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                />
                <span className="font-medium text-gray-900">{t.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  ${t.wholesale.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">{t.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </QuestionCard>

      {/* PRO: Stockout Risk */}
      <QuestionCard
        question="Am I going to run out?"
        answer="Connect Metrc to see stockout predictions."
        defaultExpanded={false}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
            <Lock className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">Pro Feature</p>
            <p className="text-sm text-gray-500 mb-3">
              Connect Metrc to see real inventory & stockout predictions
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Connect Metrc →
            </button>
          </div>

          {/* Fake preview data */}
          <div className="opacity-50 pointer-events-none">
            <div className="space-y-2">
              {[
                { name: "Blue Velvet", days: 18, risk: "medium" },
                { name: "Krypto Chronic", days: 12, risk: "high" },
                { name: "Scented Marker", days: 45, risk: "low" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={14}
                      className={
                        p.risk === "high"
                          ? "text-red-500"
                          : p.risk === "medium"
                            ? "text-yellow-500"
                            : "text-green-500"
                      }
                    />
                    <span className="text-sm text-gray-600">
                      {p.days} days until stockout
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </QuestionCard>

      {/* PRO: Production Calendar */}
      <QuestionCard
        question="When should I start production?"
        answer="Connect your production data to plan batches."
        defaultExpanded={false}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
            <Calendar className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">Pro Feature</p>
            <p className="text-sm text-gray-500 mb-3">
              Connect production data to match batches with demand
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Connect Production →
            </button>
          </div>

          {/* Fake calendar preview */}
          <div className="opacity-50 pointer-events-none">
            <div className="space-y-2">
              {[
                {
                  date: "Jan 15",
                  batch: "Blue Velvet",
                  action: "Start cultivation",
                },
                {
                  date: "Feb 1",
                  batch: "Krypto Chronic",
                  action: "Start cultivation",
                },
                {
                  date: "Mar 15",
                  batch: "Blue Velvet",
                  action: "Harvest ready",
                },
                {
                  date: "Apr 1",
                  batch: "Krypto Chronic",
                  action: "Harvest ready",
                },
              ].map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-blue-600 w-16">
                    {e.date}
                  </span>
                  <span className="font-medium text-gray-900">{e.batch}</span>
                  <span className="text-sm text-gray-500">{e.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </QuestionCard>

      {/* CTA */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          Ready to plan production?
        </h3>
        <p className="text-gray-600 mb-4">
          Connect Metrc and your production system to get real stockout alerts
          and batch scheduling.
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Upgrade to Pro →
        </button>
      </div>
    </div>
  );
}
