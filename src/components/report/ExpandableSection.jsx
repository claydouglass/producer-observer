import React, { useState } from "react";
import { ChevronDown, ChevronRight, Download } from "lucide-react";

export default function ExpandableSection({
  title,
  summary,
  children,
  defaultOpen = false,
  downloadData = null,
  downloadFilename = "data.csv",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleDownload = () => {
    if (!downloadData) return;

    // Convert to CSV
    const headers = Object.keys(downloadData[0] || {});
    const csv = [
      headers.join(","),
      ...downloadData.map((row) =>
        headers.map((h) => `"${row[h] ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown size={18} className="text-gray-400" />
          ) : (
            <ChevronRight size={18} className="text-gray-400" />
          )}
          <span className="font-medium text-gray-900">{title}</span>
          {!isOpen && summary && (
            <span className="text-sm text-gray-500 ml-2">{summary}</span>
          )}
        </div>
        {downloadData && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
          >
            <Download size={14} />
            CSV
          </button>
        )}
      </button>
      {isOpen && <div className="p-5 bg-white">{children}</div>}
    </div>
  );
}
