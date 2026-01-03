import React, { useState, useMemo } from "react";
import {
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  X,
  GripVertical,
  Truck,
  Play,
  AlertTriangle,
} from "lucide-react";

export default function RouteBuilder({ retailers, onRetailerSelect }) {
  const [routeStops, setRouteStops] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Available retailers (not in route)
  const availableRetailers = useMemo(() => {
    const routeIds = new Set(routeStops.map((s) => s.id));
    return retailers
      .filter((r) => !routeIds.has(r.id) && r.journeyStage !== "prospect")
      .sort((a, b) => {
        // Prioritize urgent
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        // Then by days since order
        return (b.daysSinceOrder || 0) - (a.daysSinceOrder || 0);
      });
  }, [retailers, routeStops]);

  // Suggested stops (urgent + overdue)
  const suggestedStops = useMemo(() => {
    return availableRetailers
      .filter(
        (r) =>
          r.isUrgent ||
          (r.daysSinceOrder && r.daysSinceOrder > r.orderFrequencyDays),
      )
      .slice(0, 5);
  }, [availableRetailers]);

  // Route stats
  const routeStats = useMemo(() => {
    if (routeStops.length === 0)
      return { stops: 0, value: 0, estimatedMiles: 0, estimatedTime: 0 };

    const totalValue = routeStops.reduce((sum, s) => sum + s.avgOrderValue, 0);
    // Rough estimate: 10 miles between stops on average
    const estimatedMiles = Math.round(routeStops.length * 10 + 15);
    // Rough estimate: 30 min per stop + 15 min drive between
    const estimatedTime = routeStops.length * 45 + 30;

    return {
      stops: routeStops.length,
      value: totalValue,
      estimatedMiles,
      estimatedTime,
    };
  }, [routeStops]);

  const addToRoute = (retailer) => {
    setRouteStops([...routeStops, retailer]);
  };

  const removeFromRoute = (retailerId) => {
    setRouteStops(routeStops.filter((s) => s.id !== retailerId));
  };

  const moveStop = (fromIndex, toIndex) => {
    const newStops = [...routeStops];
    const [removed] = newStops.splice(fromIndex, 1);
    newStops.splice(toIndex, 0, removed);
    setRouteStops(newStops);
  };

  const optimizeRoute = () => {
    // Simple optimization: group by county, then by health priority
    const optimized = [...routeStops].sort((a, b) => {
      if (a.county !== b.county) return a.county.localeCompare(b.county);
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return b.healthScore - a.healthScore;
    });
    setRouteStops(optimized);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-green-600" />
            <span className="font-semibold text-gray-900">Route Builder</span>
          </div>
          {routeStops.length > 1 && (
            <button
              onClick={optimizeRoute}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Optimize
            </button>
          )}
        </div>

        {/* Route Stats */}
        {routeStops.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {routeStats.stops}
              </div>
              <div className="text-xs text-gray-500">Stops</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {routeStats.estimatedMiles}mi
              </div>
              <div className="text-xs text-gray-500">Est. Miles</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {formatTime(routeStats.estimatedTime)}
              </div>
              <div className="text-xs text-gray-500">Est. Time</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Current Route */}
        {routeStops.length > 0 ? (
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Today's Route
            </div>
            <div className="space-y-2">
              {routeStops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg group"
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {stop.isUrgent && (
                        <AlertTriangle size={12} className="text-red-500" />
                      )}
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {stop.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ${stop.avgOrderValue} avg
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromRoute(stop.id)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Value */}
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Potential Value</span>
                <span className="text-lg font-bold text-green-700">
                  ${routeStats.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck size={24} className="text-gray-400" />
            </div>
            <div className="text-gray-600 font-medium">No stops added</div>
            <div className="text-sm text-gray-400 mt-1">
              Add retailers to build your route
            </div>
          </div>
        )}

        {/* Suggested Stops */}
        {suggestedStops.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Suggested Stops
            </div>
            <div className="space-y-2">
              {suggestedStops.map((retailer) => (
                <div
                  key={retailer.id}
                  className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {retailer.isUrgent && (
                        <AlertTriangle size={12} className="text-red-500" />
                      )}
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {retailer.name}
                      </span>
                    </div>
                    <div className="text-xs text-amber-700">
                      {retailer.daysSinceOrder}d since order
                    </div>
                  </div>
                  <button
                    onClick={() => addToRoute(retailer)}
                    className="p-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add More */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            <Plus size={18} />
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      {/* Start Route Button */}
      {routeStops.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-white">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Play size={18} />
            <span>Start Route ({routeStops.length} stops)</span>
          </button>
        </div>
      )}

      {/* Add Stop Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80%] flex flex-col m-4">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Add Stop</span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {availableRetailers.map((retailer) => (
                <button
                  key={retailer.id}
                  onClick={() => {
                    addToRoute(retailer);
                    setShowAddModal(false);
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {retailer.isUrgent && (
                      <AlertTriangle size={12} className="text-red-500" />
                    )}
                    <span className="font-medium text-gray-900">
                      {retailer.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {retailer.address}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>Health: {retailer.healthScore}</span>
                    <span>${retailer.avgOrderValue} avg</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
