import React from "react";
import ProductionPlanner from "./ProductionPlanner";

export default function SimulateTab({ selected }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Production Planning
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Plan what to grow, how much, and at what price. See real-time
          confidence based on retailer demand.
        </p>
      </div>

      <ProductionPlanner selected={selected} />
    </div>
  );
}
