import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserSummary {
  user_id: number;
  created_at: string;
  user_type: string;
  email: string;
  province: string;
  owner_name: string;
}

const RecentUsers: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get<UserSummary[]>('http://localhost:5000/api/users-summary');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  const getUserTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-[#8884d8] text-white';
      case 'sparepart':
        return 'bg-[#82ca9d] text-white';
      case 'dealership':
        return 'bg-[#ffc658] text-black';
      case 'garage':
        return 'bg-[#ff7f50] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Recent Users</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 text-black">Created Date</th>
                <th className="text-left py-2 px-4 text-black">Name</th>
                <th className="text-left py-2 px-4 text-black">User Type</th>
                <th className="text-left py-2 px-4 text-black">Email</th>
                <th className="text-left py-2 px-4 text-black">Province</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-black">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-black">{user.owner_name || '-'}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${getUserTypeBadgeColor(
                        user.user_type
                      )}`}
                    >
                      {user.user_type || '-'}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-black">{user.email || '-'}</td>
                  <td className="py-2 px-4 text-black">{user.province || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> 
    </div>
  );
};

export default RecentUsers;
