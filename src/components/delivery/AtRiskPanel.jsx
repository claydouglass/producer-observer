import React from 'react';
import { AlertTriangle, TrendingDown, Clock, ChevronRight, AlertCircle } from 'lucide-react';

export default function AtRiskPanel({ retailers, onRetailerSelect }) {
  // Sort by health score (lowest first)
  const sortedRetailers = [...retailers].sort((a, b) => a.healthScore - b.healthScore);

  // Separate into at-risk and needs attention
  const atRisk = sortedRetailers.filter(r => r.healthCategory === 'at_risk' || r.healthCategory === 'churned');
  const needsAttention = sortedRetailers.filter(r => r.healthCategory === 'needs_attention');

  const getIssue = (retailer) => {
    const issues = [];

    if (retailer.daysSinceOrder > retailer.orderFrequencyDays * 2) {
      issues.push(`No order in ${retailer.daysSinceOrder} days`);
    }

    if (retailer.healthTrend === 'declining') {
      issues.push('Health declining');
    }

    if (retailer.performance) {
      const declining = Object.entries(retailer.performance.categories)
        .filter(([_, data]) => data.trend < -20)
        .map(([cat, _]) => cat);
      if (declining.length > 0) {
        issues.push(`${declining.join(', ')} down significantly`);
      }
    }

    return issues.length > 0 ? issues[0] : 'Relationship deteriorating';
  };

  const getSuggestedAction = (retailer) => {
    if (retailer.daysSinceOrder > retailer.orderFrequencyDays * 3) {
      return 'Schedule urgent visit, bring samples';
    }
    if (retailer.healthTrend === 'declining') {
      return 'Investigate cause, consider pricing';
    }
    return 'Personal outreach recommended';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-red-50">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle size={18} />
          <span className="font-semibold">Accounts Needing Attention</span>
        </div>
        <p className="text-sm text-red-600 mt-1">
          {atRisk.length} at risk, {needsAttention.length} need attention
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* At Risk Section */}
        {atRisk.length > 0 && (
          <div className="p-3">
            <div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <AlertCircle size={12} />
              At Risk - Immediate Action Required
            </div>
            <div className="space-y-2">
              {atRisk.map((retailer) => (
                <button
                  key={retailer.id}
                  onClick={() => onRetailerSelect(retailer)}
                  className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-red-500" />
                        <span className="font-medium text-gray-900">{retailer.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{retailer.county} County</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{retailer.healthScore}</div>
                      <div className="text-xs text-gray-400">health</div>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-white rounded border border-red-100">
                    <div className="text-xs text-gray-500">Issue:</div>
                    <div className="text-sm text-red-700 font-medium">{getIssue(retailer)}</div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Last order: {retailer.daysSinceOrder} days ago
                    </span>
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      Action needed <ChevronRight size={12} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Needs Attention Section */}
        {needsAttention.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <div className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Clock size={12} />
              Needs Attention - Monitor Closely
            </div>
            <div className="space-y-2">
              {needsAttention.map((retailer) => (
                <button
                  key={retailer.id}
                  onClick={() => onRetailerSelect(retailer)}
                  className="w-full text-left p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TrendingDown size={14} className="text-amber-500" />
                        <span className="font-medium text-gray-900">{retailer.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{retailer.county} County</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">{retailer.healthScore}</div>
                      <div className="text-xs text-gray-400">health</div>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-amber-700">
                    {getIssue(retailer)}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      ${(retailer.ytdWholesale / 1000).toFixed(1)}k YTD
                    </span>
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      View details <ChevronRight size={12} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {atRisk.length === 0 && needsAttention.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} className="text-green-600" />
            </div>
            <div className="text-gray-600 font-medium">All accounts healthy!</div>
            <div className="text-sm text-gray-400 mt-1">No accounts need immediate attention</div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Review at-risk accounts weekly to prevent churn
        </div>
      </div>
    </div>
  );
}
