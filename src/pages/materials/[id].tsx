import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import {
  MapPin,
  Calendar,
  Package,
  Tag,
  Building2,
  Shield,
  Phone,
  Mail,
  ChevronLeft,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import type { MaterialListing } from '../../types/materials';

interface MaterialDetails extends MaterialListing {
  profiles: {
    business_name: string;
    verification_status: string;
    phone: string | null;
    user_type: string;
  };
}

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [material, setMaterial] = useState<MaterialDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchMaterialDetails();
    if (user) {
      checkBookmarkStatus();
    }
  }, [id, user]);

  const fetchMaterialDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('material_listings')
        .select(`
          *,
          profiles (
            business_name,
            verification_status,
            phone,
            user_type
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setMaterial(data);
    } catch (error) {
      console.error('Error fetching material details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('material_bookmarks')
        .select('id')
        .eq('user_id', user?.id)
        .eq('listing_id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isBookmarked) {
        await supabase
          .from('material_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
      } else {
        await supabase
          .from('material_bookmarks')
          .insert({
            user_id: user.id,
            listing_id: id
          });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: material?.title,
        text: material?.description,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h2>
          <p className="text-gray-600 mb-4">The material you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/materials')}
            className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/materials')}
        className="flex items-center text-gray-600 hover:text-green-600 mb-8"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Materials
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-xl overflow-hidden">
            {material.image_urls[currentImageIndex] ? (
              <img
                src={material.image_urls[currentImageIndex]}
                alt={material.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          {material.image_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {material.image_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-green-600' : ''
                  }`}
                >
                  <img
                    src={url}
                    alt={`${material.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Material Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{material.title}</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full ${
                    isBookmarked
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {material.condition}
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₹{material.price.toLocaleString()} {material.price_unit.replace('_', ' ')}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{material.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Package className="h-5 w-5 mr-2" />
                <span>
                  {material.quantity} {material.unit}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{material.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Tag className="h-5 w-5 mr-2" />
                <span>{material.condition}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(material.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {material.profiles.business_name}
                    </h3>
                    <p className="text-sm text-gray-600">{material.profiles.user_type}</p>
                  </div>
                </div>
                {material.profiles.verification_status === 'approved' && (
                  <div className="flex items-center text-green-600">
                    <Shield className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {material.profiles.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>{material.profiles.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>Contact via email</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Seller
                </button>
                <button className="flex-1 border border-green-600 text-green-600 py-3 px-6 rounded-lg hover:bg-green-50 transition-colors">
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};