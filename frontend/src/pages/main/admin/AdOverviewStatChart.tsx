import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface CountData {
  [key: string]: number | string; // API may return strings, so allow string too
}

const AdOverviewStatChart: React.FC = () => {
  const [itemTypeCounts, setItemTypeCounts] = useState<CountData | null>(null);
  const [sparePartApprovalCounts, setSparePartApprovalCounts] = useState<CountData | null>(null);
  const [vehicleApprovalCounts, setVehicleApprovalCounts] = useState<CountData | null>(null);

  useEffect(() => {
    // Fetch counts for item types
    axios.get('http://localhost:5000/api/items/count-by-type')
      .then(res => setItemTypeCounts(res.data))
      .catch(() => setItemTypeCounts(null));

    // Fetch counts for spare parts by approval
    axios.get('http://localhost:5000/api/spareparts/count-by-approval')
      .then(res => setSparePartApprovalCounts(res.data))
      .catch(() => setSparePartApprovalCounts(null));

    // Fetch counts for vehicles by approval
    axios.get('http://localhost:5000/api/vehicles/count-by-approval')
      .then(res => setVehicleApprovalCounts(res.data))
      .catch(() => setVehicleApprovalCounts(null));
  }, []);

  const renderPieChart = (data: CountData | null, title: string, keys: string[], labels: string[]) => {
    if (!data) return <p>Loading...</p>;

    // Convert values to numbers because API returns strings
    const chartData = keys.map((key, i) => ({
      name: labels[i],
      value: Number(data[key]) || 0,
    }));

    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow p-4 ">
        <h3 className="text-lg font-semibold mb-2 text-center text-black">{title}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around gap-6 p-6 bg-gray-50">
      {renderPieChart(
        itemTypeCounts,
        'Items by Type',
        ['vehicleCount', 'sparePartCount'],
        ['Vehicles', 'Spare Parts']
      )}
      {renderPieChart(
        sparePartApprovalCounts,
        'Spare Parts Approval',
        ['approvedCount', 'pendingCount', 'rejectedCount'],
        ['Approved', 'Pending', 'Rejected']
      )}
      {renderPieChart(
        vehicleApprovalCounts,
        'Vehicles Approval',
        ['approvedCount', 'pendingCount', 'rejectedCount'],
        ['Approved', 'Pending', 'Rejected']
      )}
    </div>
  );
};

export default AdOverviewStatChart;
