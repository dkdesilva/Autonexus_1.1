import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import Card from '../../../components/main/ui/Card';

interface Vehicle {
  ad_id: number;
  title: string;
  description: string;
  price: number;
  province: string;
  city: string;
  made_year: number;
  mileage: number;
  images: string[];
  approval_status?: string;
  seller?: {
    verified: boolean;
  };
  item_condition: string;
  selling_status: string;
}

const VehiclesSection: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicle/all');
        const data = await response.json();

        // Filter only approved vehicles
        const approvedVehicles = data.filter(
          (item: any) => item.approval_status === 'Approved'
        );

        // Add seller info if needed
        const withSellerInfo = approvedVehicles.map((item: any) => ({
          ...item,
          seller: { verified: true }, // mock verified seller
          location: `${item.province}, ${item.city}`,
        }));

        setVehicles(withSellerInfo);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <section id="vehicles" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Vehicles</h2>
            <div className="w-24 h-1 bg-blue-600 mb-4"></div>
          </div>
          <Link 
            to="/vehicles"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
          >
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.slice(0, 8).map((vehicle, index) => (
            <Card
              key={vehicle.ad_id}
              className="h-full animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              hoverEffect={true}
              onClick={() => window.location.href = `/details/${vehicle.ad_id}`}
            >
              <div className="relative h-36 overflow-hidden rounded-t-xl">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Removed badges from here */}
              </div>
              
              <div className="p-4">
                {/* Badges container before title */}
                <div className="flex space-x-2 mb-2">
                  {vehicle.item_condition && (
                    <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                      {vehicle.item_condition}
                    </span>
                  )}
                  {vehicle.selling_status && (
                    <span className="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                      {vehicle.selling_status}
                    </span>
                  )}
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{vehicle.title}</h3>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>{vehicle.made_year}</span>
                  <span>{Number(vehicle.mileage).toLocaleString()} km</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-base mb-2">Rs. {Number(vehicle.price).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">{vehicle.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{vehicle.city}, {vehicle.province}</span>
                  <Link to={`/details/${vehicle.ad_id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
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

export default VehiclesSection;
