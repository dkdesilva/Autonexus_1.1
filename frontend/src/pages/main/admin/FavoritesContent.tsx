// src/components/FavoritesContent.tsx
import { FiSearch, FiHeart, FiBox, FiUser, FiList } from 'react-icons/fi';

const favoritesData = [
  { type: 'product', title: 'Vuitton Sunglasses', description: 'Luxury sunglasses with UV protection', added: '2 days ago' },
  { type: 'customer', title: 'Jane Smith', description: 'Premium customer with 15 orders', added: '1 week ago' },
  { type: 'order', title: 'Order #ORD-009', description: 'Large order worth $1,200', added: '3 days ago' },
  { type: 'product', title: 'Apple Watch Series 6', description: 'Latest smartwatch with health features', added: '5 days ago' },
  { type: 'customer', title: 'John Doe', description: 'Frequent buyer with 24 orders', added: '2 weeks ago' },
  { type: 'order', title: 'Order #ORD-005', description: 'Special order with custom request', added: '4 days ago' },
];

const FavoritesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-black">Favorites</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search favorites..."
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <div className="flex space-x-2">
          <select className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Products</option>
            <option>Customers</option>
            <option>Orders</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritesData.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${item.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {item.type === 'product' ? <FiBox /> : item.type === 'customer' ? <FiUser /> : <FiList />}
              </div>
              <button className="text-red-500 hover:text-red-700">
                <FiHeart className="fill-current" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-3">{item.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Added: {item.added}</span>
              <button className="text-blue-600 hover:text-blue-800">View</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing 1 to 6 of 18 favorites
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 border rounded bg-blue-800 text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesContent;