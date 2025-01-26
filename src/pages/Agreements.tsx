import React, { useState } from 'react';
import { FileText, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Agreement } from '../types';

const Agreements = () => {
  const [showNewAgreement, setShowNewAgreement] = useState(false);
  const [agreements] = useState<Agreement[]>([
    {
      id: '1',
      partyA: 'Eco Solutions Ltd',
      partyB: 'Green Recyclers',
      material: 'Plastic Waste',
      status: 'pending',
      date: '2024-03-15'
    },
    {
      id: '2',
      partyA: 'Eco Solutions Ltd',
      partyB: 'Metal Works Inc',
      material: 'Scrap Metal',
      status: 'signed',
      date: '2024-03-10'
    }
  ]);

  const getStatusIcon = (status: Agreement['status']) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusText = (status: Agreement['status']) => {
    switch (status) {
      case 'signed':
        return 'Signed';
      case 'pending':
        return 'Pending Signature';
      case 'rejected':
        return 'Rejected';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agreements</h1>
          <p className="text-gray-600">Manage and track your material exchange agreements</p>
        </div>
        <button
          onClick={() => setShowNewAgreement(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Agreement
        </button>
      </div>

      {/* Agreements List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agreement ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agreements.map((agreement) => (
                <tr key={agreement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      {agreement.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <p className="font-medium">{agreement.partyA}</p>
                      <p className="text-gray-400">with</p>
                      <p className="font-medium">{agreement.partyB}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agreement.material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(agreement.status)}
                      <span className={`
                        ${agreement.status === 'signed' && 'text-green-600'}
                        ${agreement.status === 'pending' && 'text-yellow-600'}
                        ${agreement.status === 'rejected' && 'text-red-600'}
                      `}>
                        {getStatusText(agreement.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(agreement.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Agreement Modal */}
      {showNewAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">New Agreement</h2>
              <button
                onClick={() => setShowNewAgreement(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Party B (Recipient)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter material details"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms and Conditions
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter agreement terms"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewAgreement(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agreements;