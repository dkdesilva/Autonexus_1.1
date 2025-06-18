import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import Card from '../../../components/main/ui/Card';

interface SparePart {
  ad_id: number;
  title: string;
  description: string;
  price: number;
  province: string;
  city: string;
  made_year: number;
  images: string[];
  seller?: {
    verified: boolean;
  };
}

const SparePartSecton: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sparepart/all');
        const data = await response.json();

        const withSellerInfo = data.map((item: any) => ({
          ...item,
          seller: { verified: true }, // Dummy data, update if seller info is available
        }));

        setSpareParts(withSellerInfo);
      } catch (error) {
        console.error('Failed to fetch spare parts:', error);
      }
    };

    fetchSpareParts();
  }, []);

  return (
    <section id='spareparts' className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Spare Parts</h2>
            <div className="w-24 h-1 bg-blue-600 mb-4"></div>
          </div>
          <Link 
            to="/spareparts"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
          >
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spareParts.slice(0, 6).map((part, index) => (
            <Card 
              key={part.ad_id}
              className="h-full animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              hoverEffect={true}
              onClick={() => window.location.href = `/details/${part.ad_id}`}
            >
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img 
                  src={part.images[0]} 
                  alt={part.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {part.seller?.verified && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{part.title}</h3>
                <span className="text-gray-600 dark:text-gray-300 block mb-1">Year: {part.made_year}</span>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-3">${part.price.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{part.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{part.province}, {part.city}</span>
                  <Link
                    to={`/details/${part.ad_id}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
                  >
                    Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SparePartSecton;
