import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Star, AlertTriangle } from 'lucide-react';

const healthColors = {
  thriving: 'text-green-600 bg-green-50',
  healthy: 'text-blue-600 bg-blue-50',
  needs_attention: 'text-amber-600 bg-amber-50',
  at_risk: 'text-red-600 bg-red-50',
  churned: 'text-gray-600 bg-gray-100',
};

const journeyLabels = {
  prospect: 'Prospect',
  first_order: 'First Order',
  trial: 'Trial',
  growing: 'Growing',
  established: 'Established',
  champion: 'Champion',
};

const journeyColors = {
  prospect: 'bg-gray-200',
  first_order: 'bg-blue-200',
  trial: 'bg-blue-300',
  growing: 'bg-green-300',
  established: 'bg-green-400',
  champion: 'bg-yellow-400',
};

export default function TerritoryDashboard({ retailers, territory, rep, onRetailerSelect }) {
  // Sort retailers by priority (urgent first, then by health score descending)
  const sortedRetailers = useMemo(() => {
    return [...retailers].sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      if (a.needsAttention && !b.needsAttention) return -1;
      if (!a.needsAttention && b.needsAttention) return 1;
      return b.ytdWholesale - a.ytdWholesale;
    });
  }, [retailers]);

  // Journey distribution
  const journeyDistribution = useMemo(() => {
    const dist = {};
    retailers.forEach(r => {
      dist[r.journeyStage] = (dist[r.journeyStage] || 0) + 1;
    });
    return dist;
  }, [retailers]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'growing': return <TrendingUp size={14} className="text-green-500" />;
      case 'declining': return <TrendingDown size={14} className="text-red-500" />;
      default: return <Minus size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Journey Distribution */}
      <div className="p-4 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-700 mb-2">Journey Distribution</div>
        <div className="flex gap-1 h-6 rounded-lg overflow-hidden">
          {Object.entries(journeyLabels).map(([stage, label]) => {
            const count = journeyDistribution[stage] || 0;
            const pct = (count / retailers.length) * 100;
            if (pct < 1) return null;
            return (
              <div
                key={stage}
                className={`${journeyColors[stage]} relative group`}
                style={{ width: `${pct}%` }}
                title={`${label}: ${count}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-gray-800">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {Object.entries(journeyLabels).map(([stage, label]) => {
            const count = journeyDistribution[stage] || 0;
            if (count === 0) return null;
            return (
              <div key={stage} className="flex items-center gap-1 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${journeyColors[stage]}`} />
                <span>{label}: {count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retailer List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {sortedRetailers.map((retailer) => (
            <button
              key={retailer.id}
              onClick={() => onRetailerSelect(retailer)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {retailer.journeyStage === 'champion' && (
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    )}
                    {retailer.isUrgent && (
                      <AlertTriangle size={14} className="text-red-500" />
                    )}
                    <span className="font-medium text-gray-900 truncate">{retailer.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{retailer.address}</div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      retailer.healthScore >= 80 ? 'text-green-600' :
                      retailer.healthScore >= 60 ? 'text-blue-600' :
                      retailer.healthScore >= 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {retailer.healthScore}
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(retailer.healthTrend)}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${healthColors[retailer.healthCategory]}`}>
                  {retailer.healthCategory.replace('_', ' ')}
                </span>
                <span className="text-gray-500">
                  ${(retailer.ytdWholesale / 1000).toFixed(1)}k YTD
                </span>
                {retailer.daysSinceOrder !== null && (
                  <span className={`${retailer.daysSinceOrder > 20 ? 'text-red-500' : 'text-gray-500'}`}>
                    {retailer.daysSinceOrder}d since order
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
