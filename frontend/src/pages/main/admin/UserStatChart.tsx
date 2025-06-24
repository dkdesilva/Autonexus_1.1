import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface UserStats {
  customerCount: number;
  sparepartCount: number;
  dealerCount: number;
  garageCount: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const UserStatChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<UserStats>('http://localhost:5000/api/user-stats');
        const chartData = [
          { name: 'Customers', value: res.data.customerCount },
          { name: 'Spare Parts', value: res.data.sparepartCount },
          { name: 'Dealerships', value: res.data.dealerCount },
          { name: 'Garages', value: res.data.garageCount },
        ];
        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">User Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserStatChart;
