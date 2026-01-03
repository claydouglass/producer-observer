import React from "react";

export default function CustomersTab({ selected, brands = [] }) {
  if (!selected) return null;

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Customers Tab</h2>
        <p className="text-gray-500">Coming soon: "Who's buying my stuff?"</p>
        <p className="text-sm text-gray-400 mt-4">
          Customer loyalty, repeat rates, basket affinity, LTV
        </p>
      </div>
    </div>
  );
}
