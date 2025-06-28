import React from 'react';
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
  animationProps: any;
}

const ApprovedSpareListings: React.FC<Props> = ({ sparePartListings, animationProps }) => {
  const approvedParts = sparePartListings.filter(part => part.approval_status === 'Approved');

  return (
    <motion.div key="approved-spares" {...animationProps}>
      <h2 className="text-xl font-semibold mb-6">Approved Spare Parts</h2>

      {approvedParts.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
          <Wrench size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Approved Listings</h3>
          <p className="text-gray-600 dark:text-gray-400">
            You currently have no approved spare part listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approvedParts.map((part) => (
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

export default ApprovedSpareListings;
