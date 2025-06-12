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
                <motion.div key="listings" {...animationProps}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">My Listings</h2>
                    <Link to="/create-vehicle-add">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                        Add New Listing
                      </button>
                    </Link>
                  </div>

                  {errorListings ? (
                    <p className="text-red-600 dark:text-red-400">{errorListings}</p>
                  ) : vehicleListings.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                      <Car size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No Active Listings</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You don't have any active listings. Start selling your vehicle today!
                      </p>
                      <Link to="/create-vehicle-add">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                          Create First Listing
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{vehicleListings.map((listing) => (
  <div
    key={listing.ad_id}
                          className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-700"
  >
    {/* Image Section */}
    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
      {listing.images[0] ? (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Condition Badge */}
      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
        {listing.item_condition}
      </span>

      {/* Selling status badge */}
      {listing.selling_status && (
        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {listing.selling_status}
        </span>
      )}
    </div>

    {/* Info Section */}
    <div className="p-4 flex flex-col justify-between h-48">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={listing.title}>
          {listing.title}
        </h3>
        <p
          className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
          title={listing.description}
        >
          {listing.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          ${listing.price.toLocaleString()}
        </p>
        <div className="flex space-x-3 text-gray-500 dark:text-gray-400 text-xs">
          <div title={`Brand: ${listing.brand}`} className="flex items-center space-x-1">
            <Car size={14} />
            <span>{listing.brand}</span>
          </div>
          <div title={`Year: ${listing.made_year}`} className="flex items-center space-x-1">
            <span>•</span>
            <span>{listing.made_year}</span>
          </div>
          <div title={`Mileage: ${listing.mileage} km`} className="flex items-center space-x-1">
            <span>•</span>
            <span>{listing.mileage.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate" title={`${listing.city}, ${listing.ad_province}`}>
        {listing.city}, {listing.ad_province}
      </p>
    </div>
  </div>
))}

                    </div>
                  )}
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
                    <p className="text-gray-600 dark:text-gray-400">Your inbox is empty.</p>
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
