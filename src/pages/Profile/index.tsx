import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  Building2,
  Shield,
  HelpCircle,
} from 'lucide-react';

const Profile = () => {
  const { profile } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.business_name || 'My Profile'}
                </h2>
                <p className="text-gray-600">{profile?.user_type}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {profile?.email}
              </div>
              {profile?.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {profile.phone}
                </div>
              )}
              {profile?.gst_number && (
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  GST: {profile.gst_number}
                </div>
              )}
            </div>
          </div>

          <nav className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-6 py-4 hover:bg-green-50 border-l-4 border-transparent hover:border-green-600"
            >
              <User className="h-5 w-5 text-gray-600" />
              <span>Profile Overview</span>
            </Link>
            <Link
              to="/profile/orders"
              className="flex items-center space-x-2 px-6 py-4 hover:bg-green-50 border-l-4 border-transparent hover:border-green-600"
            >
              <Package className="h-5 w-5 text-gray-600" />
              <span>Orders</span>
            </Link>
            <Link
              to="/profile/addresses"
              className="flex items-center space-x-2 px-6 py-4 hover:bg-green-50 border-l-4 border-transparent hover:border-green-600"
            >
              <MapPin className="h-5 w-5 text-gray-600" />
              <span>Addresses</span>
            </Link>
            <Link
              to="/profile/verification"
              className="flex items-center space-x-2 px-6 py-4 hover:bg-green-50 border-l-4 border-transparent hover:border-green-600"
            >
              <Shield className="h-5 w-5 text-gray-600" />
              <span>Verification</span>
            </Link>
            <Link
              to="/profile/support"
              className="flex items-center space-x-2 px-6 py-4 hover:bg-green-50 border-l-4 border-transparent hover:border-green-600"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span>Support</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;