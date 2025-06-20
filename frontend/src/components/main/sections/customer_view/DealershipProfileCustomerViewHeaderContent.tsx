import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomerProfileImageSection from './DealershipProfileCustomerViewPrfofileImageContent';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaMap, FaBuilding, FaBirthdayCake, FaClock } from 'react-icons/fa';

interface DealershipProfile {
  dealer_id: number;
  company_name: string;
  description: string;
  founded_year?: string;
  phone_number: string;
  email: string;
  address: string;
  province: string;
  district: string;
  profile_picture?: string;
  opening_hours?: string;
  opening_days?: string;
  owner_name?: string;
  created_at?: string;
}

const DealershipProfileCustomerViewHeaderContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dealership, setDealership] = useState<DealershipProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDealership = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/dealerships/${id}`);
        if (!res.ok) throw new Error('Failed to fetch dealership data');
        const data = await res.json();
        setDealership(data);
      } catch (err) {
        setError('Error loading dealership profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDealership();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error || !dealership) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <CustomerProfileImageSection imageUrl={`http://localhost:5000/images/${dealership.profile_picture}`} />
          <div className="mt-8 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{dealership.company_name}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Established in {dealership.founded_year || 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">About Dealership</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBlock icon={<FaUser />} label="Owner" value={dealership.owner_name} />
                <InfoBlock icon={<FaEnvelope />} label="Email" value={dealership.email} />
                <InfoBlock icon={<FaPhone />} label="Phone" value={dealership.phone_number} />
                <InfoBlock icon={<FaMapMarkerAlt />} label="Address" value={`${dealership.address}, ${dealership.district}`} />
                <InfoBlock icon={<FaMap />} label="Province" value={dealership.province} />
                <InfoBlock icon={<FaBuilding />} label="District" value={dealership.district} />
                <InfoBlock icon={<FaClock />} label="Opening Hours" value={dealership.opening_hours} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBlock: React.FC<{ icon: JSX.Element; label: string; value?: string }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-2">
    <div className="mt-1 text-gray-600 dark:text-gray-300">{icon}</div>
    <div>
      <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</h1>
      <p className="text-base text-gray-800 dark:text-gray-100">{value || 'N/A'}</p>
    </div>
  </div>
);

export default DealershipProfileCustomerViewHeaderContent;
