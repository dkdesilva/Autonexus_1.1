import React, { useEffect, useState } from 'react';
import { FiUser, FiSettings, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import StatCard from '../../../components/main/ui/StatCard';
import axios from 'axios';

interface Stats {
  customerCount: number;
  sparepartCount: number;
  dealerCount: number;
  garageCount: number;
}

const DashboardStatCard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/user-stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Customers"
        value={stats.customerCount.toString()}
        change="Click to visit"
        icon={<FiUser className="text-blue-500" />}
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Total Sparepart Shops"
        value={stats.sparepartCount.toString()}
        change="Click to visit"
        icon={<FiSettings className="text-green-500" />}
        bgColor="bg-green-100"
      />
      <StatCard
        title="Total Cardealers"
        value={stats.dealerCount.toString()}
        change="Click to visit"
        icon={<FiDollarSign className="text-yellow-500" />}
        bgColor="bg-yellow-100"
      />
      <StatCard
        title="Total Garages"
        value={stats.garageCount.toString()}
        change="Click to visit"
        icon={<FiShoppingCart className="text-red-500" />}
        bgColor="bg-red-100"
      />
    </div>
  );
};

export default DashboardStatCard;
