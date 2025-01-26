import React, { useState } from 'react';
import { User, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [gstNumber, setGstNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  
  const handleGSTVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus('pending');
    // Simulating API call
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
              <p className="text-gray-600">Manage your business information and verification</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your Business Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* GST Verification */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">GST Verification</h3>
              </div>
              
              <div className="mb-4">
                {verificationStatus === 'verified' ? (
                  <div className="flex items-center space-x-2 text-green-600 mb-4">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Verified Business</span>
                  </div>
                ) : verificationStatus === 'pending' ? (
                  <div className="flex items-center space-x-2 text-yellow-600 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Verification in Progress</span>
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleGSTVerification}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter GST Number"
                    pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                    title="Please enter a valid GST number"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verificationStatus === 'pending' || verificationStatus === 'verified'}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verificationStatus === 'pending' ? 'Verifying...' : 
                   verificationStatus === 'verified' ? 'Verified' : 'Verify GST'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;