import React from 'react';
import { Car, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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
  images: string[];
}

interface Props {
  vehicleListings: VehicleListing[];
  animationProps: any;
}

const RejectedListings: React.FC<Props> = ({ vehicleListings, animationProps }) => {
  const approvedListings = vehicleListings.filter(listing => listing.approval_status === 'Rejected');

  return (
    <motion.div key="rjected" {...animationProps}>
      <h2 className="text-xl font-semibold mb-6">Approved Listings</h2>
      {approvedListings.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Approved Listings</h3>
          <p className="text-gray-600 dark:text-gray-400">
            You currently have no approved vehicle listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approvedListings.map((listing) => (
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={listing.title}>
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2" title={listing.description}>
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
  );
};

export default RejectedListings;
