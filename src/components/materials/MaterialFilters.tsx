import React from 'react';
import { Filter, Search, MapPin, Tag, Package } from 'lucide-react';
import type { MaterialSearchFilters } from '../../types/materials';

interface MaterialFiltersProps {
  filters: MaterialSearchFilters;
  onFilterChange: (filters: MaterialSearchFilters) => void;
  categories: { id: string; name: string }[];
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  filters,
  onFilterChange,
  categories,
  view,
  onViewChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4">
      {/* Search and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search materials..."
            value={filters.query || ''}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 rounded-lg ${
              view === 'grid'
                ? 'bg-green-100 text-green-600'
                : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <Package className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 rounded-lg ${
              view === 'list'
                ? 'bg-green-100 text-green-600'
                : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.categories?.[0] || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                categories: e.target.value ? [e.target.value] : undefined,
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            value={filters.condition || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                condition: e.target.value as MaterialSearchFilters['condition'],
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Any Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="recycled">Recycled</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.min || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    min: Number(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.max || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    max: Number(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'date_desc'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as MaterialSearchFilters['sortBy'],
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="date_desc">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MaterialFilters;