import React, { FC } from 'react';
import { Search } from 'lucide-react';

interface LandingSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LandingSearchBar: FC<LandingSearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="w-full flex justify-center px-4 mt-10 mb-10">
      <div className="relative w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search for vehicles, spare parts or garages..."
          className="w-full py-4 px-6 pr-14 rounded-full shadow-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
          onClick={() => {}}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LandingSearchBar;
