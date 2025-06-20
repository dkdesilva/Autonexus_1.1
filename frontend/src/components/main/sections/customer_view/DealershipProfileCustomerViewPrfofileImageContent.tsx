import React from 'react';
import { User } from 'lucide-react';

interface Props {
  imageUrl?: string | null;
}

const DealershipProfileCustomerViewPrfofileImageContent: React.FC<Props> = ({ imageUrl }) => {
  return (
    <div className="flex flex-col items-center mt-5 mr-6">
      <div className="relative rounded-full bg-white dark:bg-gray-700 mb-64 p-1 inline-block">
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-28 h-28 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-profile.jpg'; // fallback image
              }}
            />
          ) : (
            <User size={48} className="text-blue-600 dark:text-blue-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealershipProfileCustomerViewPrfofileImageContent;
