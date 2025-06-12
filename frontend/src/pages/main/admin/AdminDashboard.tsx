import { useState } from 'react';
import { FiMenu, FiSearch, FiChevronDown, FiGrid, FiBox, FiList, FiPieChart, FiDollarSign, FiBook, FiUser, FiMessageSquare, FiHeart, FiSettings, FiLogOut, FiShoppingCart, FiArrowUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-blue-800 text-white fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 shadow-md">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4">
            <FiMenu className="text-xl" />
          </button>
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-blue-200 transition">Home</a>
          <a href="#" className="hover:text-blue-200 transition">About</a>
          <a href="#" className="hover:text-blue-200 transition">Contact</a>
        </div>
      </nav>

      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <aside className={`bg-blue-900 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 fixed h-full`}>
          <div className="flex items-center p-4 h-20">
            <div className="bg-white rounded-full p-2 mr-3">
              <span className="text-blue-900 font-bold text-xl">CL</span>
            </div>
            {sidebarOpen && <span className="text-xl font-semibold">CodingLab</span>}
          </div>

          <nav className="mt-4">
            <ul>
              <SidebarItem icon={<FiGrid />} text="Dashboard" active={true} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiBox />} text="Product" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiList />} text="Order list" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiPieChart />} text="Analytics" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiDollarSign />} text="Stock" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiBook />} text="Total order" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiUser />} text="Team" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiMessageSquare />} text="Messages" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiHeart />} text="Favorites" sidebarOpen={sidebarOpen} />
              <SidebarItem icon={<FiSettings />} text="Setting" sidebarOpen={sidebarOpen} />
            </ul>
          </nav>

          <div className="absolute bottom-0 w-full p-4">
            <SidebarItem icon={<FiLogOut />} text="Log out" sidebarOpen={sidebarOpen} />
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-6`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 text-black">
                <FiMenu className="text-xl" />
              </button>
              <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-2">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-medium text-black">Prem Shahi</span>
              <FiChevronDown className="ml-2 text-black" />
            </div>
          </div>

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
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active = false, sidebarOpen }: { icon: React.ReactNode, text: string, active?: boolean, sidebarOpen: boolean }) => {
  return (
    <li className={`px-4 py-3 flex items-center ${active ? 'bg-blue-800' : 'hover:bg-blue-800'} transition cursor-pointer`}>
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="ml-3">{text}</span>}
    </li>
  );
};

const StatCard = ({ title, value, change, icon, bgColor, isDown = false }: { title: string, value: string, change: string, icon: React.ReactNode, bgColor: string, isDown?: boolean }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-black">{value}</p>
          <div className="flex items-center mt-2">
            <FiArrowUp className={`mr-1 ${isDown ? 'text-red-500 transform rotate-180' : 'text-green-500'}`} />
            <span className={`text-xs ${isDown ? 'text-red-500' : 'text-green-500'}`}>{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Sample data
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

export default AdminDashboard;