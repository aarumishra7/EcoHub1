import React, { useState } from 'react';
import { MapPin, Plus, Star, Pencil, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Office',
      street: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: '2',
      name: 'Warehouse',
      street: '456 Industrial Area',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Address
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg relative"
          >
            {address.isDefault && (
              <div className="absolute top-4 right-4 flex items-center text-green-600">
                <Star className="h-5 w-5 mr-1 fill-current" />
                <span className="text-sm font-medium">Default</span>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {address.name}
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>PIN: {address.pincode}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
              <button className="text-gray-600 hover:text-green-600">
                <Pencil className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-red-600">
                <Trash2 className="h-5 w-5" />
              </button>
              {!address.isDefault && (
                <button className="text-green-600 hover:text-green-700 font-medium">
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Address</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Office, Warehouse"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter PIN code"
                />
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="defaultAddress" className="ml-2 text-gray-700">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;