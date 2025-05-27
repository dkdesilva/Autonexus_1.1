import React from 'react';
import { MapPin, Phone, Mail, Star, Search } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Card from '../../components/main/ui/Card';
import Button from '../../components/main/ui/Button';
import { garages } from '../../data/main/mockData';

const Garages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 animate-slide-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find Nearby Garages</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Discover trusted repair shops and service centers in your area
            </p>
          </div>
          
          <div className="mt-6 lg:mt-0 w-full lg:w-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter your location"
                className="w-full lg:w-96 px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Button className="absolute right-1 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map placeholder - In a real application, this would be an interactive map */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-[28rem] animate-fade-in">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                  Interactive map would be displayed here.<br/>
                  This would show garage locations with pins and allow clicking to view details.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Garages</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type
                  </label>
                  <select 
                    id="specialties"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Services</option>
                    <option value="oil-change">Oil Change</option>
                    <option value="brake-service">Brake Service</option>
                    <option value="engine-repair">Engine Repair</option>
                    <option value="collision">Collision Repair</option>
                    <option value="diagnosis">Diagnosis</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="brand-specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand Specialty
                  </label>
                  <select 
                    id="brand-specialty"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Any Brand</option>
                    <option value="toyota">Toyota</option>
                    <option value="honda">Honda</option>
                    <option value="ford">Ford</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select 
                    id="rating"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5 & above</option>
                    <option value="4.0">4.0 & above</option>
                    <option value="3.5">3.5 & above</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Distance
                  </label>
                  <select 
                    id="distance"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="5">Within 5 miles</option>
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Showing {garages.length} garages near you
            </p>
          </div>
        </div>
        
        {/* Garages Listing */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {garages.map((garage, index) => (
            <Card 
              key={garage.id}
              className="h-full animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={garage.images[0]} 
                    alt={garage.name} 
                    className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                  />
                </div>
                
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{garage.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-gray-700 dark:text-gray-300">{garage.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {garage.specialties.map((specialty, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{garage.location.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{garage.contact.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex gap-3">
                    <Button size="sm" variant="primary">Book Service</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Garages;