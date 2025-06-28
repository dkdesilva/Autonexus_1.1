import React, { useEffect, useState } from 'react';
import { Settings, ClipboardList, Heart, MessageSquare, Wrench } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

import Navbar from '../../../components/main/layout/Navbar';
import Footer from '../../../components/main/layout/Footer';
import SparepartProfileHeaderSection from '../../../components/landing/sections/spare_part_shop/SparepartProfileHeaderSection';
import SparepartProfileFormSection from '../../../components/landing/sections/spare_part_shop/SparepartProfileFormSection';
import MySpareListings from './MySpareListings';
import ApprovedSpareListings from './ApprovedSpareListings';
import RejectedSpareListings from './RejectedSpareListings';



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
      } catch {
        setErrorProfile('Failed to fetch profile data.');
        setLoadingProfile(false);
      }
    };

    const fetchSparePartListings = async () => {
      try {
        const res = await axios.get<{ spareparts: SparePartListing[] }>('http://localhost:5000/api/customer/spareparts');
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
    { id: 'approved', label: 'Approved Listings', icon: Heart },
    { id: 'rejected', label: 'Rejected Listings', icon: MessageSquare },
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
                <MySpareListings
                  sparePartListings={sparePartListings}
                  errorListings={errorListings}
                  animationProps={animationProps}
                />
              )}

              {activeTab === 'approved' && (
                <ApprovedSpareListings
                  sparePartListings={sparePartListings} 
                  animationProps={animationProps} />
              )}

              {activeTab === 'rejected' && (
                <RejectedSpareListings 
                  sparePartListings={sparePartListings} 
                  animationProps={animationProps} />
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
