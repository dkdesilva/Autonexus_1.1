// src/components/Sidebar.tsx
import {
  FiGrid,
  FiBox,
  FiList,
  FiPieChart,
  FiDollarSign,
  FiBook,
  FiUser,
  FiMessageSquare,
  FiHeart,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { FaRegUser,FaCar   } from "react-icons/fa";
import { LiaToolsSolid } from "react-icons/lia";
import { BiSolidCarGarage } from "react-icons/bi";
import { TfiCar } from "react-icons/tfi";
import SidebarItem from './SidebarItem';
import logo from '../../../../assets/alogo1.png';

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab }: SidebarProps) => {
  return (
    <aside
      className={`bg-blue-900 text-white ${
        sidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 fixed h-full`}
    >
      <div className="flex items-center p-4 h-20">
        <div className="p-0 mr-0">
          <img
            src={logo}
            alt="AutoNexus Logo Light"
            className={`object-contain transition-all duration-300 ${
              sidebarOpen ? 'w-28 h-28' : 'w-40 h-40'
            }`}
          />
        </div>
      </div>

      <nav className="mt-4">
        <ul>
          <SidebarItem
            icon={<FiGrid />}
            text="Dashboard"
            active={activeTab === 'Dashboard'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Dashboard')}
          />
          <SidebarItem
            icon={<FaRegUser  />}
            text="Customer Details"
            active={activeTab === 'Customer Details'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Customer Details')}
          />
          <SidebarItem
            icon={<LiaToolsSolid />}
            text="Sparepart Shop Details"
            active={activeTab === 'Sparepart Shop Details'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Sparepart Shop Details')}
          />
          <SidebarItem
            icon={<FaCar  />}
            text="Vehicledealer Shop Details"
            active={activeTab === 'Vehicledealer Shop Details'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Vehicledealer Shop Details')}
          />
          <SidebarItem
            icon={<BiSolidCarGarage  />}
            text="Garage Details"
            active={activeTab === 'Garage Details'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Garage Details')}
          />
          <SidebarItem
            icon={<TfiCar />}
            text="Vehicle Ad List"
            active={activeTab === 'Vehicle Ad List'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Vehicle Ad List')}
          />
          <SidebarItem
            icon={<FiBook />}
            text="Total order"
            active={activeTab === 'Total order'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Total order')}
          />
          <SidebarItem
            icon={<FiHeart />}
            text="Favorites"
            active={activeTab === 'Favorites'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Favorites')}
          />
          <SidebarItem
            icon={<FiSettings />}
            text="Setting"
            active={activeTab === 'Setting'}
            sidebarOpen={sidebarOpen}
            onClick={() => setActiveTab('Setting')}
          />
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <SidebarItem
          icon={<FiLogOut />}
          text="Log out"
          sidebarOpen={sidebarOpen}
          onClick={() => console.log('Logging out...')}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
