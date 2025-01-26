import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Material } from '../types';

const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMaterial, setShowNewMaterial] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    'Metal',
    'Plastic',
    'Paper',
    'Glass',
    'Electronics',
    'Textile',
    'Other'
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      let query = supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMaterial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { error } = await supabase
        .from('materials')
        .insert([{
          name: formData.get('name') as string,
          category: formData.get('category') as string,
          quantity: formData.get('quantity') as string,
          location: formData.get('location') as string,
        }]);

      if (error) throw error;
      
      setShowNewMaterial(false);
      fetchMaterials();
      form.reset();
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materials Exchange</h1>
          <p className="text-gray-600">Browse and list materials for exchange</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => setShowNewMaterial(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            List Material
          </button>
        </div>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="text-center py-12">Loading materials...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{material.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {material.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span> {material.quantity}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {material.location}
                </p>
                <p className="text-sm text-gray-500">
                  Listed on: {new Date(material.created_at).toLocaleDateString()}
                </p>
              </div>
              <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300">
                Contact Seller
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Material Modal */}
      {showNewMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">List New Material</h2>
              <button
                onClick={() => setShowNewMaterial(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleNewMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter material name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  name="quantity"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 100 kg, 50 units"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewMaterial(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  List Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;