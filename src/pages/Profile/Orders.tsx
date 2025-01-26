import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Filter } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const Orders = () => {
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-01-20',
      status: 'delivered',
      total: 1500,
      items: [
        { name: 'Recycled Plastic', quantity: 100, price: 10 },
        { name: 'Metal Scraps', quantity: 50, price: 10 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-25',
      status: 'shipped',
      total: 2000,
      items: [
        { name: 'Paper Waste', quantity: 200, price: 10 }
      ]
    }
  ]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <button className="flex items-center px-4 py-2 text-gray-600 hover:text-green-600">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h3>
                <p className="text-gray-600">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="font-medium">{getStatusText(order.status)}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <div className="text-gray-600">
                Total Amount: <span className="font-semibold">₹{order.total}</span>
              </div>
              <button className="px-4 py-2 text-green-600 hover:text-green-700 font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;