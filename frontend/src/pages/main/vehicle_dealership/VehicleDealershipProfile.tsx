import React, { useEffect, useState } from 'react';
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

const VehicleDealershipProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const fetchUserProfile = async () => {
      try {
        // Try getting token from localStorage or sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        // Set axios default header globally
        setAuthToken(token);

        const res = await axios.get<UserProfile>('http://localhost:5000/api/user');

        setUser(res.data);
        setLoading(false);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Unauthorized. Please login again.');
          } else {
            setError('Failed to fetch profile data.');
          }
        } else {
          setError('An error occurred while fetching profile data.');
        }
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Cleanup axios header on unmount (optional)
    return () => {
      setAuthToken(null);
    };
  }, []);
  

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Car },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="space-y-8 sm:px-8 md:px-12 lg:px-24 pb-16 pt-20">
        {/* Profile Header */}

        <CustomerProfileHeaderSection/>
        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
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
                <motion.div key="listings" {...animationProps}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">My Listings</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                      Add New Listing
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                    <Car size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Active Listings</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You don't have any active listings. Start selling your vehicle today!
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                      Create First Listing
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'favorites' && (
                <motion.div key="favorites" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Favorites</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                    <Heart size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Favorites Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Add vehicles to your favorites to see them here.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div key="messages" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Messages</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Messages</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your inbox is empty.
                    </p>
                  </div>
                </motion.div>
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
                    <CustomerProfileFormSection/>
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

export default VehicleDealershipProfile;
