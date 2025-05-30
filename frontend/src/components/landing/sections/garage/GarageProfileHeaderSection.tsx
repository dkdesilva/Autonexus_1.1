import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerProfileImageSection from '../../sections/garage/GarageProfileImageSection';

interface UserProfile {
  company_name: string;
  customer_created_at: string;
  listingsCount?: number;
  soldCount?: number;
  favoritesCount?: number;
}

const GarageProfileHeaderSection: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'AutoNexus - Your Profile';

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        // Use your actual API endpoint here
        const res = await fetch('http://localhost:5000/api/garage/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError('Unauthorized. Please login again.');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
          } else {
            setError('Failed to fetch profile data.');
          }
          setLoading(false);
          return;
        }

        const data: UserProfile = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching profile data.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/signin');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">

          <CustomerProfileImageSection />

          <div className="mt-4 md:mt-0 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{user?.company_name}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Member since{' '}
                  {new Date(user!.customer_created_at).getFullYear()}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={() => alert('Edit profile clicked')}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-semibold">{user?.listingsCount ?? 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Listings</div>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-semibold">{user?.soldCount ?? 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sold</div>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-semibold">{user?.favoritesCount ?? 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageProfileHeaderSection;
