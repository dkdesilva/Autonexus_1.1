// src/components/StatCard.tsx
import { ReactNode } from 'react';
import { FiArrowUp } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  bgColor: string;
  isDown?: boolean;
}

const StatCard = ({ title, value, change, icon, bgColor, isDown = false }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-black">{value}</p>
          <div className="flex items-center mt-2">
            <FiArrowUp className={`mr-1 ${isDown ? 'text-red-500 transform rotate-180' : 'text-green-500'}`} />
            <span className={`text-xs ${isDown ? 'text-red-500' : 'text-green-500'}`}>{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;