import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  ClipboardList,
  Heart,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

import Navbar from '../../../components/main/layout/Navbar';
import Footer from '../../../components/main/layout/Footer';
import SparepartProfileHeaderSection from '../../../components/landing/sections/spare_part_shop/SparepartProfileHeaderSection';
import SparepartProfileFormSection from '../../../components/landing/sections/spare_part_shop/SparepartProfileFormSection';

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;
}

interface SparePartListing {
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
  spare_id: number;
  brand: string;
  color: string;
  material: string;
  model_compatibility: string;
  made_year: number;
  quantity: number;
  spare_created_at: string;
  images: string[];
}

const SparePartsProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sparePartListings, setSparePartListings] = useState<SparePartListing[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [errorListings, setErrorListings] = useState<string | null>(null);

  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    document.title = 'AutoNexus - Spare Parts Profile';

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setErrorProfile('No token found. Please login.');
      setLoadingProfile(false);
      setLoadingListings(false);
      return;
    }
    setAuthToken(token);

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get<UserProfile>('http://localhost:5000/api/user');
        setUser(res.data);
        setLoadingProfile(false);
      } catch (err) {
        setErrorProfile('Failed to fetch profile data.');
        setLoadingProfile(false);
      }
    };

    const fetchSparePartListings = async () => {
      try {
        const res = await axios.get<{ spareparts: SparePartListing[] }>(
          'http://localhost:5000/api/customer/spareparts'
        );
        setSparePartListings(res.data.spareparts);
        setLoadingListings(false);
      } catch {
        setErrorListings('Failed to fetch your spare part listings.');
        setLoadingListings(false);
      }
    };

    fetchUserProfile();
    fetchSparePartListings();

    return () => setAuthToken(null);
  }, []);

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Wrench },
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
        <SparepartProfileHeaderSection />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
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

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'listings' && (
                <motion.div key="listings" {...animationProps}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">My Spare Parts</h2>
                    <Link to="/create-sparepart-add">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Add New Part
                      </button>
                    </Link>
                  </div>

                  {errorListings ? (
                    <p className="text-red-600 dark:text-red-400">{errorListings}</p>
                  ) : sparePartListings.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                      <Wrench size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No Spare Part Listings</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You haven't listed any spare parts yet.
                      </p>
                      <Link to="/create-sparepart-add">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                          Create First Listing
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {sparePartListings.map((part) => (
                        <div key={part.ad_id} className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-700">
                          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            {part.images[0] ? (
                              <img
                                src={part.images[0]}
                                alt={part.title}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                            <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              {part.item_condition}
                            </span>
                            {part.selling_status && (
                              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                {part.selling_status}
                              </span>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {part.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {part.description}
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="block">Brand: {part.brand}</span>
                              <span className="block">Model: {part.model_compatibility}</span>
                              <span className="block">Quantity: {part.quantity}</span>
                            </div>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              ${part.price.toLocaleString()}
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
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <Heart size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No favorites yet.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div key="messages" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Messages</h2>
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No messages yet.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div key="activity" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Activity</h2>
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <ClipboardList size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No recent activity.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Settings</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8">
                    <SparepartProfileFormSection />
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

export default SparePartsProfile;
