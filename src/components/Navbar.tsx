import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, FileText, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span>EcoHub</span>
            </NavLink>
          </div>
          
          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`
              }
            >
              <Home className="h-5 w-5 mr-1" />
              Home
            </NavLink>
            
            <NavLink
              to="/materials"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`
              }
            >
              <Package className="h-5 w-5 mr-1" />
              Materials
            </NavLink>
            
            <NavLink
              to="/agreements"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`
              }
            >
              <FileText className="h-5 w-5 mr-1" />
              Agreements
            </NavLink>
            
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`
              }
            >
              <User className="h-5 w-5 mr-1" />
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;