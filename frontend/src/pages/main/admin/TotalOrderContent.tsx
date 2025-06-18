// src/components/TotalOrderContent.tsx
import { FiArrowUp } from 'react-icons/fi';

const topCustomers = [
  { name: 'Alex Doe', email: 'alex@example.com', orders: '24', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: 'Jane Smith', email: 'jane@example.com', orders: '18', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'David Johnson', email: 'david@example.com', orders: '15', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Sarah Williams', email: 'sarah@example.com', orders: '12', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'Michael Brown', email: 'michael@example.com', orders: '10', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const TotalOrderContent = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-black">Total Orders</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-black">1,245</div>
          <div className="text-xs text-green-600 flex items-center">
            <FiArrowUp className="mr-1" /> 12% from last month
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-800 mb-1">Completed</div>
          <div className="text-2xl font-bold text-black">876</div>
          <div className="text-xs text-green-600 flex items-center">
            <FiArrowUp className="mr-1" /> 8% from last month
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-800 mb-1">Pending</div>
          <div className="text-2xl font-bold text-black">245</div>
          <div className="text-xs text-red-600 flex items-center">
            <FiArrowUp className="mr-1 transform rotate-180" /> 3% from last month
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-red-800 mb-1">Cancelled</div>
          <div className="text-2xl font-bold text-black">124</div>
          <div className="text-xs text-red-600 flex items-center">
            <FiArrowUp className="mr-1 transform rotate-180" /> 1% from last month
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4 text-black">Orders Over Time</h3>
        <div className="h-64 bg-white border rounded flex items-center justify-center">
          <span className="text-gray-500">Line Chart</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-black">Top Customers</h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="text-black">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </div>
                <div className="text-black">{customer.orders} orders</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-black">Order Sources</h3>
          <div className="h-64 bg-white border rounded flex items-center justify-center">
            <span className="text-gray-500">Doughnut Chart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalOrderContent;