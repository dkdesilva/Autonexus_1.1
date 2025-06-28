import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

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

interface Props {
  sparePartListings: SparePartListing[];
  errorListings: string | null;
  animationProps: any;
}

const MySpareListings: React.FC<Props> = ({ sparePartListings, errorListings, animationProps }) => {
  return (
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
            <div
              key={part.ad_id}
              className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-700"
            >
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
  );
};

export default MySpareListings;
