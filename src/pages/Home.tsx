import React from 'react';
import { ArrowRight, Recycle, Shield, HandshakeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Turning Waste into Resources
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Join our circular economy platform to connect with businesses, trade materials,
              and contribute to a sustainable future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/materials"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="px-6 py-3 rounded-lg bg-white text-green-600 font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">List Materials</h3>
            <p className="text-gray-600">
              Post your excess materials or browse available listings from other businesses.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verify Business</h3>
            <p className="text-gray-600">
              Complete GST verification to ensure secure and legitimate transactions.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <HandshakeIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Make Agreements</h3>
            <p className="text-gray-600">
              Create and sign digital agreements securely through our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;