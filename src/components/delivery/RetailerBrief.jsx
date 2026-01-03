import React from 'react';
import { X, MessageSquare, TrendingUp, TrendingDown, Minus, AlertTriangle, Star, Clock, DollarSign, Package, User, Calendar, ChevronRight, Mic } from 'lucide-react';

const healthColors = {
  thriving: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
  healthy: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
  needs_attention: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' },
  at_risk: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
  churned: { bg: 'bg-gray-100', text: 'text-gray-700', bar: 'bg-gray-400' },
};

const journeyLabels = {
  prospect: 'Prospect',
  first_order: 'First Order',
  trial: 'Trial Period',
  growing: 'Growing',
  established: 'Established Partner',
  champion: 'Champion',
};

export default function RetailerBrief({ retailer, onClose, onChat }) {
  if (!retailer) return null;

  const colors = healthColors[retailer.healthCategory] || healthColors.healthy;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'growing': return <TrendingUp size={14} className="text-green-500" />;
      case 'declining': return <TrendingDown size={14} className="text-red-500" />;
      default: return <Minus size={14} className="text-gray-400" />;
    }
  };

  const getTrendLabel = (trend) => {
    switch (trend) {
      case 'growing': return 'Growing';
      case 'declining': return 'Declining';
      default: return 'Stable';
    }
  };

  // Generate talking points based on retailer data
  const talkingPoints = [];

  if (retailer.isUrgent) {
    talkingPoints.push({
      priority: 'urgent',
      text: `Overdue for order (${retailer.daysSinceOrder} days, usually every ${retailer.orderFrequencyDays} days)`,
    });
  }

  if (retailer.performance) {
    // Check for low stock categories
    Object.entries(retailer.performance.categories).forEach(([cat, data]) => {
      if (data.velocity > 0 && data.units < data.velocity * 2) {
        talkingPoints.push({
          priority: 'high',
          text: `${cat} running low - ${data.units} units, sells ${data.velocity}/week`,
        });
      }
    });

    // Check for declining products
    Object.entries(retailer.performance.categories).forEach(([cat, data]) => {
      if (data.trend < -15) {
        talkingPoints.push({
          priority: 'medium',
          text: `${cat} down ${Math.abs(data.trend)}% - investigate cause`,
        });
      }
    });

    // Check for opportunities (categories not carried)
    const notCarried = ['Flower', 'Pre-Rolls', 'Cartridges', 'Edibles', 'Concentrates']
      .filter(cat => !retailer.performance.categories[cat]);
    if (notCarried.length > 0) {
      talkingPoints.push({
        priority: 'opportunity',
        text: `Not carrying: ${notCarried.join(', ')} - potential opportunity`,
      });
    }
  }

  if (retailer.lastVisit?.notes) {
    talkingPoints.push({
      priority: 'followup',
      text: `Follow up: "${retailer.lastVisit.notes}"`,
    });
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {retailer.journeyStage === 'champion' && (
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              )}
              <h3 className="font-semibold text-gray-900">{retailer.name}</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{retailer.address}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Health Score */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Relationship Health</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${colors.text}`}>{retailer.healthScore}</span>
              <span className="text-gray-400">/100</span>
              {getTrendIcon(retailer.healthTrend)}
              <span className="text-xs text-gray-500">{getTrendLabel(retailer.healthTrend)}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar} transition-all duration-500`}
              style={{ width: `${retailer.healthScore}%` }}
            />
          </div>
        </div>

        {/* Journey Stage */}
        <div className="mt-2 flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
            {journeyLabels[retailer.journeyStage]}
          </span>
          {retailer.isUrgent && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
              <AlertTriangle size={12} />
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 border-b border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            ${(retailer.avgOrderValue / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-gray-500">Avg Order</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {retailer.orderFrequencyDays}d
          </div>
          <div className="text-xs text-gray-500">Order Freq</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            ${(retailer.ytdWholesale / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-500">YTD Value</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Key Contacts */}
        {retailer.contacts && retailer.contacts.length > 0 && (
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Contacts</div>
            {retailer.contacts.map((contact, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <User size={14} className="text-gray-400" />
                <span className="font-medium">{contact.name}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{contact.role}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 text-xs">Prefers {contact.preferredTime}</span>
              </div>
            ))}
          </div>
        )}

        {/* Product Performance */}
        {retailer.performance && (
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Performance by Category</div>
            <div className="space-y-2">
              {Object.entries(retailer.performance.categories).map(([cat, data]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{data.units} units</span>
                    <span className={`flex items-center gap-1 ${
                      data.trend > 0 ? 'text-green-600' : data.trend < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {data.trend > 0 ? <TrendingUp size={12} /> : data.trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                      {Math.abs(data.trend)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type Breakdown */}
        {retailer.performance && (
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Type Preference</div>
            <div className="flex gap-2">
              {Object.entries(retailer.performance.types).map(([type, data]) => (
                <div key={type} className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">{type}</div>
                  <div className="text-lg font-semibold text-gray-900">{data.share}%</div>
                  <div className={`text-xs ${data.trend > 0 ? 'text-green-600' : data.trend < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {data.trend > 0 ? '+' : ''}{data.trend}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {retailer.orderHistory && retailer.orderHistory.length > 0 && (
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recent Orders</div>
            <div className="space-y-1">
              {retailer.orderHistory.slice(-3).reverse().map((order, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{order.date}</span>
                  <span className="font-medium text-gray-700">${order.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Talking Points */}
        {talkingPoints.length > 0 && (
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Suggested Talking Points</div>
            <div className="space-y-2">
              {talkingPoints.map((point, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                    point.priority === 'urgent' ? 'bg-red-50 text-red-700' :
                    point.priority === 'high' ? 'bg-amber-50 text-amber-700' :
                    point.priority === 'opportunity' ? 'bg-green-50 text-green-700' :
                    'bg-blue-50 text-blue-700'
                  }`}
                >
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{point.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Visit Notes */}
        {retailer.lastVisit && (
          <div className="p-3 bg-gray-50">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Visit</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{retailer.lastVisit.date}</span>
              <span className="text-gray-400"> by </span>
              <span>{retailer.lastVisit.rep}</span>
            </div>
            {retailer.lastVisit.notes && (
              <div className="mt-1 text-sm text-gray-700 italic">"{retailer.lastVisit.notes}"</div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <button
          onClick={onChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Mic size={18} />
          <span>Talk to VP About This Account</span>
        </button>
      </div>
    </div>
  );
}
