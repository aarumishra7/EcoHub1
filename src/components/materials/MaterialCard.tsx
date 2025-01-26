import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Package, Tag, Calendar } from 'lucide-react';
import type { MaterialListing } from '../../types/materials';

interface MaterialCardProps {
  material: MaterialListing;
  view?: 'grid' | 'list';
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, view = 'grid' }) => {
  const formatPrice = (price: number, unit: string) => {
    return `₹${price.toLocaleString()} ${unit.replace('_', ' ')}`;
  };

  if (view === 'list') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4">
        <div className="flex gap-4">
          {material.image_urls[0] && (
            <img
              src={material.image_urls[0]}
              alt={material.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{material.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice(material.price, material.price_unit)}
                </p>
                <p className="text-sm text-gray-500">
                  {material.quantity} {material.unit}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {material.location}
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                {material.condition}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(material.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Posted by: {material.business_name}
              </div>
              <Link
                to={`/materials/${material.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      {material.image_urls[0] ? (
        <img
          src={material.image_urls[0]}
          alt={material.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {material.title}
          </h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {material.condition}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {material.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">
              {material.quantity} {material.unit}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-green-600">
              {formatPrice(material.price, material.price_unit)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {material.location}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to={`/materials/${material.id}`}
            className="block w-full text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;