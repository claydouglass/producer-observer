import React, { useState, useMemo } from "react";
import {
  MapPin,
  Users,
  AlertTriangle,
  TrendingDown,
  Navigation,
  Mic,
  MessageSquare,
  Calendar,
  ChevronRight,
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DeliveryMap from "./DeliveryMap";
import RetailerBrief from "./RetailerBrief";
import VPChat from "./VPChat";
import {
  retailers,
  territories,
  retailerStats,
  getRetailersByRegion,
  getAtRiskRetailers,
  getDecliningRetailers,
} from "../../data/retailers";

// Simulated orders for route building
const generateOrders = (territoryRetailers) => {
  return territoryRetailers
    .filter((r) => r.journeyStage !== "prospect" && r.daysSinceOrder > 5)
    .slice(0, 6)
    .map((r, i) => ({
      id: `ORD-${Date.now()}-${i}`,
      retailer: r,
      orderValue: r.avgOrderValue + Math.floor(Math.random() * 500 - 250),
      units: Math.floor(r.avgOrderValue / 25),
      status: i === 0 ? "new" : i < 3 ? "confirmed" : "ready",
      requestedDate: "Today",
      categories: ["Flower", "Pre-Rolls"].slice(
        0,
        Math.floor(Math.random() * 2) + 1,
      ),
    }));
};

export default function DeliveryTab() {
  const [selectedRep, setSelectedRep] = useState("Emily Davis");
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [showVPChat, setShowVPChat] = useState(false);
  const [expandedRetailer, setExpandedRetailer] = useState(null);

  // Get current rep's territory
  const currentTerritory = useMemo(() => {
    return (
      Object.entries(territories).find(
        ([_, t]) => t.rep === selectedRep,
      )?.[0] || "Southern Oregon"
    );
  }, [selectedRep]);

  // Get retailers for current territory
  const territoryRetailers = useMemo(() => {
    return getRetailersByRegion(currentTerritory);
  }, [currentTerritory]);

  // Generate orders for route
  const orders = useMemo(() => {
    return generateOrders(territoryRetailers);
  }, [territoryRetailers]);

  // Route from orders
  const routeStops = useMemo(() => {
    return orders.map((order, i) => ({
      ...order,
      stopNumber: i + 1,
      estimatedTime: `${9 + Math.floor(i * 1.5)}:${i % 2 === 0 ? "00" : "30"} AM`,
    }));
  }, [orders]);

  // Territory stats
  const territoryStats = useMemo(() => {
    const reps = territoryRetailers;
    return {
      total: reps.length,
      healthy: reps.filter((r) => r.healthScore >= 60).length,
      needsAttention: reps.filter((r) => r.healthCategory === "needs_attention")
        .length,
      atRisk: reps.filter(
        (r) => r.healthCategory === "at_risk" || r.healthCategory === "churned",
      ).length,
      urgent: reps.filter((r) => r.isUrgent).length,
      avgHealth: Math.round(
        reps.reduce((sum, r) => sum + r.healthScore, 0) / reps.length,
      ),
      totalWholesale: reps.reduce((sum, r) => sum + r.ytdWholesale, 0),
    };
  }, [territoryRetailers]);

  // Route stats
  const routeStats = useMemo(() => {
    const totalValue = routeStops.reduce((sum, s) => sum + s.orderValue, 0);
    const totalUnits = routeStops.reduce((sum, s) => sum + s.units, 0);
    return {
      stops: routeStops.length,
      value: totalValue,
      units: totalUnits,
      estimatedMiles: Math.round(routeStops.length * 12 + 15),
      estimatedTime: routeStops.length * 45 + 30,
    };
  }, [routeStops]);

  // Handle retailer selection from map
  const handleRetailerSelect = (retailer) => {
    setSelectedRetailer(retailer);
    setExpandedRetailer(retailer.id);
  };

  // Handle VP chat open
  const handleOpenChat = (retailer = null) => {
    if (retailer) setSelectedRetailer(retailer);
    setShowVPChat(true);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "ready":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Delivery & Field Intelligence
          </h2>
          <p className="text-gray-500 mt-1">
            Your VP for retailer relationships
          </p>
        </div>

        {/* Rep Selector */}
        <div className="flex items-center gap-4">
          <select
            value={selectedRep}
            onChange={(e) => setSelectedRep(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(territories).map(([region, t]) => (
              <option key={region} value={t.rep}>
                {t.rep} - {region}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleOpenChat()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mic size={18} />
            <span>Talk to VP</span>
          </button>
        </div>
      </div>

      {/* Route Summary Bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-green-200 text-sm">Today's Route</div>
              <div className="text-2xl font-bold">{routeStats.stops} Stops</div>
            </div>
            <div className="h-10 w-px bg-green-500" />
            <div>
              <div className="text-green-200 text-sm">Total Value</div>
              <div className="text-2xl font-bold">
                ${routeStats.value.toLocaleString()}
              </div>
            </div>
            <div className="h-10 w-px bg-green-500" />
            <div>
              <div className="text-green-200 text-sm">Units</div>
              <div className="text-2xl font-bold">{routeStats.units}</div>
            </div>
            <div className="h-10 w-px bg-green-500" />
            <div>
              <div className="text-green-200 text-sm">Est. Distance</div>
              <div className="text-2xl font-bold">
                {routeStats.estimatedMiles} mi
              </div>
            </div>
            <div className="h-10 w-px bg-green-500" />
            <div>
              <div className="text-green-200 text-sm">Est. Time</div>
              <div className="text-2xl font-bold">
                {formatTime(routeStats.estimatedTime)}
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Start Route
          </button>
        </div>
      </div>

      {/* Main Content - Map and Route */}
      <div className="grid grid-cols-3 gap-6">
        {/* Map - Takes 2 columns */}
        <div
          className="col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden"
          style={{ height: "400px" }}
        >
          <DeliveryMap
            retailers={territoryRetailers}
            selectedRetailer={selectedRetailer}
            onRetailerSelect={handleRetailerSelect}
            territory={currentTerritory}
            routeStops={routeStops.map((s) => s.retailer)}
          />
        </div>

        {/* Route Panel */}
        <div
          className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
          style={{ height: "400px" }}
        >
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-green-600" />
                <span className="font-semibold text-gray-900">
                  Route from Orders
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {routeStats.stops} deliveries
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {routeStops.map((stop) => (
              <button
                key={stop.id}
                onClick={() => handleRetailerSelect(stop.retailer)}
                className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedRetailer?.id === stop.retailer.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {stop.stopNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {stop.retailer.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stop.status)}`}
                      >
                        {stop.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {stop.estimatedTime}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-green-600 font-medium">
                        ${stop.orderValue}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{stop.units} units</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 mt-2" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Retailer Intel Section - Full Width Below */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Retailer Intelligence</h3>
          <p className="text-sm text-gray-500">
            Click any stop for full briefing. Chat with VP for deeper insights.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {routeStops.map((stop) => (
            <div key={stop.id} className="group">
              {/* Collapsed Row */}
              <button
                onClick={() =>
                  setExpandedRetailer(
                    expandedRetailer === stop.retailer.id
                      ? null
                      : stop.retailer.id,
                  )
                }
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                      {stop.stopNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {stop.retailer.journeyStage === "champion" && (
                          <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {stop.retailer.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            stop.retailer.healthScore >= 80
                              ? "bg-green-100 text-green-700"
                              : stop.retailer.healthScore >= 60
                                ? "bg-blue-100 text-blue-700"
                                : stop.retailer.healthScore >= 40
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          Health: {stop.retailer.healthScore}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {stop.retailer.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${stop.orderValue}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stop.units} units
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {stop.estimatedTime}
                      </div>
                      <div className="text-xs text-gray-500">ETA</div>
                    </div>
                    {expandedRetailer === stop.retailer.id ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Detail */}
              {expandedRetailer === stop.retailer.id && (
                <div className="px-4 pb-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Relationship Summary */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Relationship
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Health Score
                          </span>
                          <span
                            className={`font-semibold ${
                              stop.retailer.healthScore >= 80
                                ? "text-green-600"
                                : stop.retailer.healthScore >= 60
                                  ? "text-blue-600"
                                  : stop.retailer.healthScore >= 40
                                    ? "text-amber-600"
                                    : "text-red-600"
                            }`}
                          >
                            {stop.retailer.healthScore}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Trend</span>
                          <span className="flex items-center gap-1 text-sm">
                            {stop.retailer.healthTrend === "growing" ? (
                              <>
                                <TrendingUp
                                  size={14}
                                  className="text-green-500"
                                />{" "}
                                Growing
                              </>
                            ) : stop.retailer.healthTrend === "declining" ? (
                              <>
                                <TrendingDown
                                  size={14}
                                  className="text-red-500"
                                />{" "}
                                Declining
                              </>
                            ) : (
                              <>Stable</>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Stage</span>
                          <span className="text-sm font-medium capitalize">
                            {stop.retailer.journeyStage.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Last Order
                          </span>
                          <span className="text-sm">
                            {stop.retailer.daysSinceOrder} days ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Order History
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Avg Order
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${stop.retailer.avgOrderValue}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Order Freq
                          </span>
                          <span className="text-sm">
                            Every {stop.retailer.orderFrequencyDays} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            YTD Value
                          </span>
                          <span className="font-semibold text-green-600">
                            ${(stop.retailer.ytdWholesale / 1000).toFixed(1)}k
                          </span>
                        </div>
                      </div>
                      {stop.retailer.orderHistory &&
                        stop.retailer.orderHistory.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">
                              Recent:
                            </div>
                            {stop.retailer.orderHistory
                              .slice(-2)
                              .reverse()
                              .map((order, i) => (
                                <div
                                  key={i}
                                  className="text-xs text-gray-600 flex justify-between"
                                >
                                  <span>{order.date}</span>
                                  <span>${order.value}</span>
                                </div>
                              ))}
                          </div>
                        )}
                    </div>

                    {/* Performance */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Performance
                      </div>
                      {stop.retailer.performance ? (
                        <div className="space-y-1">
                          {Object.entries(stop.retailer.performance.categories)
                            .slice(0, 4)
                            .map(([cat, data]) => (
                              <div
                                key={cat}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-600">{cat}</span>
                                <span
                                  className={`flex items-center gap-1 ${
                                    data.trend > 0
                                      ? "text-green-600"
                                      : data.trend < 0
                                        ? "text-red-600"
                                        : "text-gray-400"
                                  }`}
                                >
                                  {data.trend > 0 ? "+" : ""}
                                  {data.trend}%
                                </span>
                              </div>
                            ))}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                              Type preference:
                            </div>
                            <div className="flex gap-2 mt-1">
                              {Object.entries(
                                stop.retailer.performance.types,
                              ).map(([type, data]) => (
                                <span
                                  key={type}
                                  className="text-xs px-2 py-0.5 bg-gray-100 rounded"
                                >
                                  {type}: {data.share}%
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">
                          No performance data
                        </div>
                      )}
                    </div>

                    {/* Actions & Notes */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Context & Actions
                      </div>
                      {stop.retailer.contacts?.[0] && (
                        <div className="text-sm mb-2">
                          <span className="text-gray-500">Contact:</span>{" "}
                          <span className="font-medium">
                            {stop.retailer.contacts[0].name}
                          </span>{" "}
                          <span className="text-gray-400">
                            ({stop.retailer.contacts[0].role})
                          </span>
                        </div>
                      )}
                      {stop.retailer.lastVisit?.notes && (
                        <div className="text-sm text-gray-600 italic mb-3">
                          "{stop.retailer.lastVisit.notes}"
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenChat(stop.retailer)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <MessageSquare size={14} />
                          Chat with VP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* VP Chat Modal */}
      {showVPChat && (
        <VPChat
          retailer={selectedRetailer}
          rep={selectedRep}
          territory={currentTerritory}
          onClose={() => setShowVPChat(false)}
        />
      )}
    </div>
  );
}
