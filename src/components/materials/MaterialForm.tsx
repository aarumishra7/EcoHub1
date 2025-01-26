import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import {
  Package,
  Upload,
  X,
  Loader2,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import type { MaterialListing } from '../../types/materials';

interface MaterialFormProps {
  onSubmit: (data: Partial<MaterialListing>) => Promise<void>;
  initialData?: Partial<MaterialListing>;
  isEdit?: boolean;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<MaterialListing>>(
    initialData || {
      title: '',
      description: '',
      category_id: '',
      subcategory_id: null,
      quantity: 0,
      unit: 'kg',
      condition: 'used',
      price: 0,
      price_unit: 'per_kg',
      location: '',
      certification_urls: [],
      image_urls: [],
      status: 'draft',
    }
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(
      file => file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    setImages(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 images
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Upload images
      if (images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `materials/${profile?.id}/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
              .from('materials')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('materials')
              .getPublicUrl(filePath);

            return publicUrl;
          })
        );

        formData.image_urls = [...(formData.image_urls || []), ...imageUrls];
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter material title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your material"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="ton">Tons</option>
                <option value="pieces">Pieces</option>
                <option value="meters">Meters</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as MaterialListing['condition'] })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="recycled">Recycled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Unit
              </label>
              <select
                value={formData.price_unit}
                onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="per_kg">Per Kg</option>
                <option value="per_ton">Per Ton</option>
                <option value="per_piece">Per Piece</option>
                <option value="total">Total</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter location"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (Max 5, up to 5MB each)
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500'}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop images here, or click to select'}
          </p>
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Package className="h-5 w-5 mr-2" />
              {isEdit ? 'Update Listing' : 'Create Listing'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;