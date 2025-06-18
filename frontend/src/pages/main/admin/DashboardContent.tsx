// src/components/DashboardContent.tsx
import { FiShoppingCart, FiDollarSign, FiArrowUp } from 'react-icons/fi';
import StatCard from '../../../components/main/ui/StatCard';

const salesData = [
  { date: '02 Jan 2021', customer: 'Alex Doe', status: 'Delivered', total: '$204.98', topProduct: 'Vuitton Sunglasses' },
  { date: '02 Jan 2021', customer: 'David Mart', status: 'Pending', total: '$24.55', topProduct: 'Hourglass Jeans' },
  { date: '02 Jan 2021', customer: 'Roe Porter', status: 'Returned', total: '$25.88', topProduct: 'Nike Sport Shop' },
  { date: '02 Jan 2021', customer: 'Diana Penty', status: 'Delivered', total: '$170.66', topProduct: 'Hermes Silk Scarves' },
  { date: '02 Jan 2021', customer: 'Martin Pow', status: 'Pending', total: '$56.56', topProduct: 'Succi Ladies Bag' },
  { date: '02 Jan 2021', customer: 'Doe Alex', status: 'Returned', total: '$44.95', topProduct: 'Gucci Womens\'s Bags' },
  { date: '02 Jan 2021', customer: 'Alana Lexa', status: 'Delivered', total: '$67.33', topProduct: 'Addidas Running Shop' },
  { date: '02 Jan 2021', customer: 'Revel Mogs', status: 'Pending', total: '$23.53', topProduct: '' },
  { date: '', customer: 'Tiana Lotts', status: 'Delivered', total: '$46.52', topProduct: '' },
];

const topProducts = [
  { name: 'Vuitton Sunglasses', price: '$1107', image: 'https://via.placeholder.com/40' },
  { name: 'Hourglass Jeans', price: '$1567', image: 'https://via.placeholder.com/40' },
  { name: 'Nike Sport Shoe', price: '$1234', image: 'https://via.placeholder.com/40' },
  { name: 'Hermes Silk Scarves', price: '$2312', image: 'https://via.placeholder.com/40' },
  { name: 'Succi Ladies Bag', price: '$1456', image: 'https://via.placeholder.com/40' },
  { name: 'Gucci Womens\'s Bags', price: '$2345', image: 'https://via.placeholder.com/40' },
  { name: 'Addidas Running Shoe', price: '$2345', image: 'https://via.placeholder.com/40' },
];

const DashboardContent = () => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Order"
          value="40,876"
          change="Up from yesterday"
          icon={<FiShoppingCart className="text-blue-500" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Total Sales"
          value="38,876"
          change="Up from yesterday"
          icon={<FiShoppingCart className="text-green-500" />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="Total Profit"
          value="$12,876"
          change="Up from yesterday"
          icon={<FiDollarSign className="text-yellow-500" />}
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Total Return"
          value="11,086"
          change="Down From Today"
          icon={<FiShoppingCart className="text-red-500" />}
          bgColor="bg-red-100"
          isDown={true}
        />
      </div>

      {/* Sales Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-black">Date</th>
                  <th className="text-left py-2 px-4 text-black">Customer</th>
                  <th className="text-left py-2 px-4 text-black">Sales</th>
                  <th className="text-left py-2 px-4 text-black">Total</th>
                  <th className="text-left py-2 px-4 text-black">Top Selling Product</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-black">{sale.date}</td>
                    <td className="py-2 px-4 text-black">{sale.customer}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sale.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        sale.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-black">{sale.total}</td>
                    <td className="py-2 px-4 text-black">{sale.topProduct || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              See All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Top Selling Product</h2>
          <ul className="space-y-4">
            {topProducts.map((product, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover mr-3"
                  />
                  <span className="text-black">{product.name}</span>
                </div>
                <span className="font-medium text-black">{product.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;