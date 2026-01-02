import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import PageHeader from "./components/PageHeader";
import Footer from "./components/Footer";
import ForecastTab from "./components/ForecastTab";
import GapsTab from "./components/GapsTab";
import SimulateTab from "./components/SimulateTab";
import PartnershipTab from "./components/PartnershipTab";
import ReportTab from "./components/report/ReportTab";
import { brands } from "./data/brands";
import { suppliers } from "./data/suppliers";
import { scenarioMultipliers } from "./data/multipliers";

const RETAILER_NAME = "Miracle Greens Bend";

export default function App() {
  const [activeTab, setActiveTab] = useState("forecast");
  const [scenario, setScenario] = useState("base");
  const [viewMode, setViewMode] = useState("brand"); // 'brand' or 'supplier'
  const [selectedBrand, setSelectedBrand] = useState(brands[0]?.id);
  const [decisions, setDecisions] = useState({
    indicaSupply: true,
    launch510LR: false,
    launchGummies: false,
    launch1ozDeal: false,
    expandConcentrates: false,
  });

  // Get currently selected entity
  const items = viewMode === "brand" ? brands : suppliers;
  const selected = useMemo(
    () => items.find((i) => i.id === selectedBrand) || items[0],
    [items, selectedBrand],
  );

  // Build chart data from selected entity's monthly data
  const chartData = useMemo(() => {
    if (!selected?.byMonth) return [];

    const monthOrder = [
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
    ];
    const historyMonths = [
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return monthOrder.map((month) => {
      const value = selected.byMonth[month] || 0;
      const isHistory = historyMonths.includes(month);

      if (isHistory) {
        return {
          month,
          value: Math.round(value),
          type: "history",
          min: null,
          max: null,
        };
      }

      // Forecast months - project based on average wholesale
      const avgMonthly = selected.wholesale / 8; // 8 months of data
      const projected = Math.round(avgMonthly * scenarioMultipliers[scenario]);
      return {
        month,
        value: projected,
        type: "forecast",
        min: Math.round(projected * 0.8),
        max: Math.round(projected * 1.2),
      };
    });
  }, [selected, scenario]);

  // Calculate forecast with decisions
  const calculateForecast = () => {
    if (!selected) return 0;
    let base = (selected.wholesale / 8) * 6; // 6 month projection
    if (!decisions.indicaSupply) base *= 0.7;
    let additions = 0;
    if (decisions.launch510LR) additions += 3000;
    if (decisions.launchGummies) additions += 2500;
    if (decisions.launch1ozDeal) additions += 1500;
    if (decisions.expandConcentrates) additions += 1000;
    return Math.round((base + additions) * scenarioMultipliers[scenario]);
  };

  const calculateScenarioForecast = (s) => {
    if (!selected) return 0;
    let base = (selected.wholesale / 8) * 6;
    if (!decisions.indicaSupply) base *= 0.7;
    let additions = 0;
    if (decisions.launch510LR) additions += 3000;
    if (decisions.launchGummies) additions += 2500;
    if (decisions.launch1ozDeal) additions += 1500;
    if (decisions.expandConcentrates) additions += 1000;
    return Math.round((base + additions) * scenarioMultipliers[s]);
  };

  const forecast = calculateForecast();
  const historyData = chartData.filter((d) => d.type === "history");
  const forecastData = chartData.filter((d) => d.type === "forecast");
  const historyTotal = historyData.reduce((sum, d) => sum + d.value, 0);
  const historyPeak = Math.max(...historyData.map((d) => d.value), 0);
  const forecastTotal = forecastData.reduce((sum, d) => sum + d.value, 0);
  const forecastMin = forecastData.reduce((sum, d) => sum + (d.min || 0), 0);
  const forecastMax = forecastData.reduce((sum, d) => sum + (d.max || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brands={brands}
        suppliers={suppliers}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <PageHeader
        selected={selected}
        viewMode={viewMode}
        retailerName={RETAILER_NAME}
      />

      <main className="max-w-6xl mx-auto px-8 py-8">
        {activeTab === "forecast" && (
          <ForecastTab
            chartData={chartData}
            selected={selected}
            forecastTotal={forecastTotal}
            historyPeak={historyPeak}
            historyTotal={historyTotal}
            forecastMin={forecastMin}
            forecastMax={forecastMax}
            brands={brands}
          />
        )}

        {activeTab === "gaps" && <GapsTab selected={selected} />}

        {activeTab === "simulate" && <SimulateTab selected={selected} />}

        {activeTab === "partnership" && <PartnershipTab selected={selected} />}

        {activeTab === "report" && (
          <ReportTab selected={selected} brands={brands} />
        )}
      </main>

      <Footer />
    </div>
  );
}
