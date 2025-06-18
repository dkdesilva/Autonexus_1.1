import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

interface UserCustomerData {
  user_id: number;
  cus_id: number;
  email: string;
  user_type: string;
  phone_number: string;
  address: string;
  province: string;
  district: string;
  profile_picture: string | null;
  cover_picture: string | null;
  user_created_at: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  birthday: string;
}

const CustomerDeatilsContent = () => {
  const [data, setData] = useState<UserCustomerData[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/customer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchAllData();
  }, []);

  const filtered = data.filter(item =>
    `${item.first_name} ${item.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">User Details</h2>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name..."
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
              <th className="py-2 px-4">Customer ID</th>
              <th className="py-2 px-4">Profile</th>
              <th className="py-2 px-4">Full Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">User Type</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Province</th>
              <th className="py-2 px-4">District</th>
              <th className="py-2 px-4">Gender</th>
              <th className="py-2 px-4">Birthday</th>
              <th className="py-2 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.user_id} className="border-b hover:bg-gray-50 text-black">
                <td className="py-2 px-4">{item.user_id}</td>
                <td className="py-2 px-4">{item.cus_id}</td>
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
                <td className="py-2 px-4">{`${item.first_name} ${item.middle_name || ''} ${item.last_name}`}</td>
                <td className="py-2 px-4">{item.email}</td>
                <td className="py-2 px-4">{item.phone_number}</td>
                <td className="py-2 px-4">{item.user_type}</td>
                <td className="py-2 px-4">{item.address}</td>
                <td className="py-2 px-4">{item.province}</td>
                <td className="py-2 px-4">{item.district}</td>
                <td className="py-2 px-4">{item.gender}</td>
                <td className="py-2 px-4">
                  {item.birthday && !isNaN(new Date(item.birthday).getTime())
                    ? new Date(item.birthday).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })
                    : '00/00/0000'}
                </td>
                <td className="py-2 px-4">
                  {item.user_created_at && !isNaN(new Date(item.user_created_at).getTime())
                    ? new Date(item.user_created_at).toLocaleDateString()
                    : 'Invalid Date'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDeatilsContent;
