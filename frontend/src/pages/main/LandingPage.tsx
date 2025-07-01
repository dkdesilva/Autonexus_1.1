import React from 'react';
import { Search } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import LandingPageVehicles from './LandingPageVehicles';
import LandingPageSpareParts from './LandingPageSpareParts';

const LandingPage: React.FC = () => {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <LandingPageVehicles />
      <LandingPageSpareParts />
      <Footer />
    </div>
    </div>
  );
};

export default LandingPage;
