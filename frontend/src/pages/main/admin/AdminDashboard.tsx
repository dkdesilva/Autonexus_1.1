// src/AdminDashboard.tsx
import { useState } from 'react';
import { FiMenu, FiSearch, FiChevronDown } from 'react-icons/fi';
import Sidebar from '../../../components/main/sections/admin/Sidebar';
import DashboardContent from './DashboardContent';
import CustomerDeatilsContent from './CustomerDeatilsContent';
import SparePartShopDetailsContent from './SparePartShopDetailsContent';
import VehicleAdListContent from './VehicleAdListContent';
import SparepartAdListContent from './SparepartAdListContent';
import FavoritesContent from './FavoritesContent';
import SettingsContent from './SettingsContent';
import VehicleDealerDetailsContent from './VehicleDealerDetailsContent';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Customer Details':
        return <CustomerDeatilsContent />;
      case 'Sparepart Shop Details':
        return <SparePartShopDetailsContent />;
      case 'Vehicledealer Shop Details':
        return <VehicleDealerDetailsContent />;
      case 'Vehicle Ad List':
        return <VehicleAdListContent />;
      case 'Sparepart Ad List':
        return <SparepartAdListContent />;
      case 'Favorites':
        return <FavoritesContent />;
      case 'Setting':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
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
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-6 overflow-x-auto`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 text-black">
                <FiMenu className="text-xl" />
              </button>
              <h1 className="text-2xl font-semibold text-black">{activeTab}</h1>
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

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;