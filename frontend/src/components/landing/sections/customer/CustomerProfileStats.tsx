import React from 'react';

interface StatsProps {
  AllListingsCount?: number;
  ApprovedListingsCount?: number;
  RejectededListingsCount?: number;
}

const CustomerProfileStats: React.FC<StatsProps> = ({
  AllListingsCount = 0,
  ApprovedListingsCount = 0,
  RejectededListingsCount = 0,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-xl font-semibold">{AllListingsCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">All Listings</div>
      </div>
      <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-xl font-semibold">{ApprovedListingsCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Approved Listings</div>
      </div>
      <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-xl font-semibold">{RejectededListingsCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Rejected Listings</div>
      </div>
    </div>
  );
};

export default CustomerProfileStats;
