import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Heart,
  MessageSquare,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../../components/main/layout/Navbar';
import Footer from '../../../components/main/layout/Footer';
import CustomerProfileFormSection from '../../../components/landing/sections/customer/CustomerProfileFormSection';
import CustomerProfileHeaderSection from '../../../components/landing/sections/customer/CustomerProfileHeaderSection';
import axios from 'axios';
import ApprovedListings from './ApprovedListings';
import RejectedListings from './RejectedListings';
import MyListings from './MyListings';

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;
  listingsCount: number;
  soldCount: number;
  favoritesCount: number;
}

interface VehicleListing {
  ad_id: number;
  title: string;
  description: string;
  price: number;
  ad_province: string;
  city: string;
  ad_phone: string;
  selling_status: string;
  approval_status: string;
  ad_created_at: string;
  item_id: number;
  item_type: string;
  item_condition: string;
  item_created_at: string;
  vehicle_id: number;
  brand: string;
  color: string;
  made_year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  vehicle_created_at: string;
  images: string[]; // Array of image URLs
}

const CustomerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [vehicleListings, setVehicleListings] = useState<VehicleListing[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [errorListings, setErrorListings] = useState<string | null>(null);

  // Set axios default auth header for all API calls after getting token
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    document.title = 'AutoNexus - Your Profile';

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setErrorProfile('No token found. Please login.');
      setLoadingProfile(false);
      setLoadingListings(false);
      return;
    }
    setAuthToken(token);

    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get<UserProfile>('http://localhost:5000/api/user');
        setUser(res.data);
        setLoadingProfile(false);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setErrorProfile('Unauthorized. Please login again.');
          } else {
            setErrorProfile('Failed to fetch profile data.');
          }
        } else {
          setErrorProfile('An error occurred while fetching profile data.');
        }
        setLoadingProfile(false);
      }
    };

    // Fetch vehicle listings
    const fetchVehicleListings = async () => {
      try {
        const res = await axios.get<{ vehicles: VehicleListing[] }>(
          'http://localhost:5000/api/customer/vehicles'
        );
        setVehicleListings(res.data.vehicles);
        setLoadingListings(false);
      } catch (err: any) {
        setErrorListings('Failed to fetch your vehicle listings.');
        setLoadingListings(false);
      }
    };

    fetchUserProfile();
    fetchVehicleListings();

    // Cleanup axios header on unmount
    return () => {
      setAuthToken(null);
    };
  }, []);

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Car },
    { id: 'approved', label: 'Approved Listings', icon: Heart },
    { id: 'rjected', label: 'Rejected Listings', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  if (loadingProfile || loadingListings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">{errorProfile}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="space-y-8 sm:px-8 md:px-12 lg:px-24 pb-16 pt-20">
        {/* Profile Header */}
        <CustomerProfileHeaderSection />

        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Animated Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'listings' && (
                <MyListings vehicleListings={vehicleListings} errorListings={errorListings} animationProps={animationProps}/>
              )}

              {activeTab === 'approved' && (
                <ApprovedListings vehicleListings={vehicleListings} animationProps={animationProps} />
              )}

              {activeTab === 'rjected' && (
                <RejectedListings vehicleListings={vehicleListings} animationProps={animationProps} />
              )}

              {activeTab === 'activity' && (
                <motion.div key="activity" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Activity</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                    <ClipboardList size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your recent activities will appear here.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Settings</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8">
                    <CustomerProfileFormSection />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerProfile;
