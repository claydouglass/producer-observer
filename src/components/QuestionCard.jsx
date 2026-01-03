import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function QuestionCard({ question, answer, children, defaultExpanded = true }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-start justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{question}</h2>
          {answer && (
            <p className="text-gray-600 mt-1">{answer}</p>
          )}
        </div>
        {expanded ? (
          <ChevronUp size={20} className="text-gray-400 mt-1 flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-gray-400 mt-1 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="px-6 py-5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
