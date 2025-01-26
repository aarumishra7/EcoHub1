import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  Package, 
  Search, 
  ShoppingCart, 
  User,
  Bell,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const { user, profile } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span>EcoHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/materials" className="text-gray-600 hover:text-green-600 transition-colors">
              Materials
            </Link>
            <Link to="/agreements" className="text-gray-600 hover:text-green-600 transition-colors">
              Agreements
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-green-600 transition-colors">
              Support
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search materials..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="text-gray-600 hover:text-green-600">
                  <Bell className="h-6 w-6" />
                </button>
                <button className="text-gray-600 hover:text-green-600">
                  <ShoppingCart className="h-6 w-6" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="hidden md:inline-block font-medium">
                      {profile?.business_name || 'My Account'}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/addresses"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                      >
                        Addresses
                      </Link>
                      <button
                        onClick={() => useAuthStore.getState().signOut()}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <Link
              to="/materials"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Materials
            </Link>
            <Link
              to="/agreements"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Agreements
            </Link>
            <Link
              to="/support"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Support
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;