import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { Material } from '../types';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{material.name}</h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Category:</span> {material.category}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Quantity:</span> {material.quantity}
        </p>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {material.location}
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(material.timestamp).toLocaleDateString()}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Posted by: {material.postedBy}
        </p>
      </div>
      <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300">
        Contact Seller
      </button>
    </div>
  );
};

export default MaterialCard;