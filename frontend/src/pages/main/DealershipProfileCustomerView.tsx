import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Car } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import DealershipProfileCustomerViewHeaderContent from '../../components/main/sections/customer_view/DealershipProfileCustomerViewHeaderContent';
import axios from 'axios';

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
  image_url1?: string;
  image_url2?: string;
  image_url3?: string;
  image_url4?: string;
  images: string[];
}

const DealershipProfileCustomerView: React.FC = () => {
  const { id: dealerId } = useParams<{ id: string }>();
  const [vehicleListings, setVehicleListings] = useState<VehicleListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [errorListings, setErrorListings] = useState<string | null>(null);

  const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  const fetchVehicleListings = async () => {
    if (!dealerId) {
      setErrorListings('Invalid dealer ID.');
      setLoadingListings(false);
      return;
    }
    try {
      const res = await axios.get<VehicleListing[]>(`http://localhost:5000/api/dealerships/${dealerId}/listings`);

      // Convert individual image fields to images array for display
      const vehiclesWithImages = res.data.map(listing => ({
        ...listing,
        images: [
          listing.image_url1,
          listing.image_url2,
          listing.image_url3,
          listing.image_url4,
        ].filter((img): img is string => Boolean(img)), // remove undefined/null
      }));
      setVehicleListings(vehiclesWithImages);
      setLoadingListings(false);
    } catch (err) {
      setErrorListings('Failed to fetch vehicle listings.');
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchVehicleListings();
  }, [dealerId]);

  if (loadingListings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading listings...</p>
      </div>
    );
  }

  if (errorListings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">{errorListings}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="space-y-8 sm:px-8 md:px-12 lg:px-24 pb-16 pt-20">
        {/* Show dealership header/profile info */}
        <DealershipProfileCustomerViewHeaderContent />

        {/* Listings section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key="listings" {...animationProps}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Listings</h2>
                </div>

                {vehicleListings.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
                    <Car size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Active Listings</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {vehicleListings.map((listing) => (
                      <div
                        key={listing.ad_id}
                        className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-700"
                      >
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
                          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            {listing.item_condition}
                          </span>
                          {listing.selling_status && (
                            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              {listing.selling_status}
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col justify-between h-48">
                          <div>
                            <h3
                              className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                              title={listing.title}
                            >
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
                              <div className="flex items-center space-x-1">
                                <Car size={14} />
                                <span>{listing.brand}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>•</span>
                                <span>{listing.made_year}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>•</span>
                                <span>{listing.mileage.toLocaleString()} km</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate">
                            {listing.city}, {listing.ad_province}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DealershipProfileCustomerView;
