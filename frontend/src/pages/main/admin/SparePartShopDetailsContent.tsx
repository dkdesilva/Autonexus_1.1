import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

interface SparePartUserData {
  user_id: number;
  email: string;
  user_type: string;
  phone_number: string;
  address: string;
  province: string;
  district: string;
  profile_picture: string | null;
  cover_picture: string | null;
  user_created_at: string;
  spare_id: number;
  company_name: string;
  description: string;
  founded_year: number;
  owner_name: string;
  opening_days: string;
  opening_hours: string;
  shop_created_at: string;
}

const SparePartShopDetailsContent = () => {
  const [data, setData] = useState<SparePartUserData[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/spareparts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const filtered = data.filter(item =>
    item.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Sparepart Shop Details</h2>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max border table-auto">
          <thead>
            <tr className="border-b text-left text-black">
              <th className="py-2 px-4">User ID</th>
              <th className="py-2 px-4">Spare ID</th>
              <th className="py-2 px-4">Profile</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">User Type</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Province</th>
              <th className="py-2 px-4">District</th>
              <th className="py-2 px-4">User Created At</th>
              <th className="py-2 px-4">Company</th>
              <th className="py-2 px-4">Owner</th>
              <th className="py-2 px-4">Founded</th>
              <th className="py-2 px-4">Opening Days</th>
              <th className="py-2 px-4">Opening Hours</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.user_id} className="border-b hover:bg-gray-50 text-black">
                <td className="py-2 px-4">{item.user_id}</td>
                <th className="py-2 px-4">{item.spare_id}</th>
                <td className="py-2 px-4">
                  <img
                    src={item.profile_picture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt="profile"
                    className="w-10 h-10 rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                    }}
                  />
                </td>
                <td className="py-2 px-4">{item.email}</td>
                <td className="py-2 px-4">{item.phone_number}</td>
                <td className="py-2 px-4">{item.user_type}</td>
                <td className="py-2 px-4">{item.address}</td>
                <td className="py-2 px-4">{item.province}</td>
                <td className="py-2 px-4">{item.district}</td>
                <td className="py-2 px-4">
                  {item.user_created_at && !isNaN(new Date(item.user_created_at).getTime())
                    ? new Date(item.user_created_at).toLocaleDateString()
                    : 'Invalid Date'}
                </td>
                <td className="py-2 px-4">{item.company_name}</td>
                <td className="py-2 px-4">{item.owner_name}</td>
                <td className="py-2 px-4">{item.founded_year}</td>
                <td className="py-2 px-4">{item.opening_days}</td>
                <td className="py-2 px-4">{item.opening_hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SparePartShopDetailsContent;
