import React from "react";
import VervanaLogo from "./VervanaLogo";

// Data starts May 16, 2025 (from CSV)
const DATA_START_DATE = "May 16, 2025";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between text-xs text-gray-400">
        <span>Confidential · Data Starts {DATA_START_DATE}</span>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <VervanaLogo height={12} />
        </div>
      </div>
    </footer>
  );
}
