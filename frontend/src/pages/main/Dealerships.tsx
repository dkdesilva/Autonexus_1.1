import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Phone, Mail, Star, Search, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Button from '../../components/main/ui/Button';

const Dealerships: React.FC = () => {
  const [dealerships, setDealerships] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dealerships');
        setDealerships(res.data);
      } catch (err) {
        console.error('Error fetching dealership data:', err);
      }
    };
    fetchDealerships();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 animate-slide-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dealership Showrooms</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Browse virtual showrooms of top dealerships in your area
            </p>
          </div>

          <div className="mt-6 lg:mt-0 w-full lg:w-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search dealerships by name or brand"
                className="w-full lg:w-96 px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Dealerships Listing */}
        <div className="space-y-10">
          {dealerships.map((dealership, index) => (
            <div 
              key={dealership.dealer_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="md:flex">
                <div className="md:w-1/3 lg:w-1/4 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={`http://localhost:5000/images/${dealership.profile_picture}`} 
                    alt={dealership.company_name} 
                    className="w-full h-60 md:h-full object-cover"
                  />
                </div>

                <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{dealership.company_name}</h2>
                        <div className="ml-3 flex items-center text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </div>
                      </div>

                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 dark:text-gray-300">4.0 rating</span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        12 vehicles in stock
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>Open today:</span>
                        <span className="ml-1 text-gray-700 dark:text-gray-300">
                          {dealership.opening_hours}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {dealership.description}
                      </p>
                    </div>

                    <div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                          <MapPin className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span>{dealership.address}, {dealership.district}, {dealership.province}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Phone className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <span>{dealership.phone_number}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Mail className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <span>{dealership.email}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button onClick={() => navigate(`/dealership/${dealership.dealer_id}`)}>View Inventory</Button>
                        <Button variant="outline">Contact Dealership</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {dealership.vehicles && dealership.vehicles.length > 0 ? (
                      dealership.vehicles
                        .filter((vehicle: any) => vehicle.approval_status?.toLowerCase() === 'approved')
                        .map((vehicle: any, index: number) => (
                          <div 
                            key={vehicle.ad_id || index}
                            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="h-24 w-full bg-gray-200 dark:bg-gray-600">
                              <img 
                                src={vehicle.image_url || '/images/default.jpg'} 
                                alt={vehicle.title || 'Vehicle'} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {vehicle.title || 'Untitled Vehicle'}
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                                ${vehicle.price}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No featured vehicles available.</p>
                    )}
                  </div>

 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dealerships;
