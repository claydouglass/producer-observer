import React from "react";
import { Download, Share2 } from "lucide-react";
import VervanaLogo from "./VervanaLogo";
import BrandSelector from "./BrandSelector";
import { tabs } from "../data/constants";

export default function Header({
  activeTab,
  setActiveTab,
  brands,
  suppliers,
  selectedBrand,
  setSelectedBrand,
  viewMode,
  setViewMode,
}) {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("forecast")}
            className="hover:opacity-80 transition-opacity"
            title="Go to Producer Observer home"
          >
            <VervanaLogo height={18} />
          </button>
          <BrandSelector
            brands={brands}
            suppliers={suppliers}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm ${
                  activeTab === tab.id
                    ? "text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <button className="text-gray-400 hover:text-gray-600">
              <Download size={18} />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
