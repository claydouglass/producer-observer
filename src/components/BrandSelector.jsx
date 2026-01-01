import React, { useState } from 'react';
import { ChevronDown, Building2, Users } from 'lucide-react';

export default function BrandSelector({
  brands,
  suppliers,
  selectedBrand,
  setSelectedBrand,
  viewMode,
  setViewMode,
}) {
  const [open, setOpen] = useState(false);

  const items = viewMode === 'brand' ? brands : suppliers;
  const selected = items.find(i => i.id === selectedBrand) || items[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 min-w-[280px]"
      >
        <div className="flex items-center gap-2 text-gray-400">
          {viewMode === 'brand' ? <Building2 size={16} /> : <Users size={16} />}
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-gray-400">
            {viewMode === 'brand' ? 'Brand' : 'Supplier'} View
          </div>
          <div className="font-medium text-gray-900 truncate">
            {selected?.name || 'Select...'}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          #{selected?.rank}
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-hidden">
            {/* View mode toggle */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setViewMode('brand')}
                className={`flex-1 px-4 py-2 text-sm ${
                  viewMode === 'brand'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Brands ({brands.length})
              </button>
              <button
                onClick={() => setViewMode('supplier')}
                className={`flex-1 px-4 py-2 text-sm ${
                  viewMode === 'supplier'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Suppliers ({suppliers.length})
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-72">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedBrand(item.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50 ${
                    selectedBrand === item.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-6">
                      #{item.rank}
                    </span>
                    <span className="text-sm text-gray-900 truncate max-w-[160px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ${(item.revenue / 1000).toFixed(1)}K
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
