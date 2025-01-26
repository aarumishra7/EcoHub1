import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import MaterialFilters from '../../components/materials/MaterialFilters';
import MaterialCard from '../../components/materials/MaterialCard';
import type { MaterialListing } from '../../types/materials';
import type { MaterialSearchFilters } from '../../types/materials';

const Materials = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<MaterialListing[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MaterialSearchFilters>({
    sortBy: 'date_desc'
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('material_categories')
        .select('id, name')
        .is('parent_id', null)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('material_listings')
        .select(`
          *,
          profiles!material_listings_user_id_fkey (
            business_name,
            verification_status
          )
        `)
        .eq('status', 'published');

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters.categories?.length) {
        query = query.in('category_id', filters.categories);
      }

      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined) {
          query = query.gte('price', filters.priceRange.min);
        }
        if (filters.priceRange.max !== undefined) {
          query = query.lte('price', filters.priceRange.max);
        }
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'date_desc':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // If sorting by distance, we need to calculate distances and sort manually
      if (filters.sortBy === 'distance' && filters.location) {
        // Implementation for distance-based sorting would go here
        // This would require the browser's geolocation API and a distance calculation function
      }

      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: MaterialSearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <MaterialFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        view={view}
        onViewChange={setView}
      />

      {/* Materials Grid/List */}
      {loading ? (
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No materials found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className={`mt-8 ${
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }`}>
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              view={view}
            />
          ))}
        </div>
      )}
    </div>
  );
};