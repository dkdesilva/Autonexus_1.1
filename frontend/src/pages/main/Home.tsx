import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Card from '../../components/main/ui/Card';
import Button from '../../components/main/ui/Button';
import { vehicles, spareParts } from '../../data/main/mockData';

type ItemType = 'vehicles' | 'parts';

const Home: React.FC = () => {
  const [itemType, setItemType] = useState<ItemType>('vehicles');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  
  const displayItems = itemType === 'vehicles' ? vehicles : spareParts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 animate-slide-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Browse the latest listings from our verified community
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <button 
                className={`px-4 py-2 rounded-l-lg font-medium ${
                  itemType === 'vehicles' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
                onClick={() => setItemType('vehicles')}
              >
                Vehicles
              </button>
              <button 
                className={`px-4 py-2 rounded-r-lg font-medium ${
                  itemType === 'parts' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
                onClick={() => setItemType('parts')}
              >
                Spare Parts
              </button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={toggleFilter}
              icon={<Filter className="h-5 w-5" />}
              className="sm:ml-2"
            >
              Filters
            </Button>
          </div>
        </div>
        
        {/* Filter Section */}
        {isFilterOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {itemType === 'vehicles' ? 'Vehicle Type' : 'Category'}
                </label>
                <select 
                  id="category"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All {itemType === 'vehicles' ? 'Types' : 'Categories'}</option>
                  {itemType === 'vehicles' ? (
                    <>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="sports">Sports</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </>
                  ) : (
                    <>
                      <option value="engine">Engine</option>
                      <option value="brakes">Brakes</option>
                      <option value="suspension">Suspension</option>
                      <option value="electrical">Electrical</option>
                      <option value="body">Body & Exterior</option>
                      <option value="interior">Interior</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <select 
                  id="brand"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Brands</option>
                  <option value="toyota">Toyota</option>
                  <option value="honda">Honda</option>
                  <option value="ford">Ford</option>
                  <option value="bmw">BMW</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="tesla">Tesla</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" className="mr-3">
                Reset
              </Button>
              <Button>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <Card 
              key={item.id}
              className="h-full animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              hoverEffect={true}
              onClick={() => window.location.href = `/details/${item.id}`}
            >
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {item.seller.verified && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                {itemType === 'vehicles' ? (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">{item.title}</span>
                    <span className="text-gray-600 dark:text-gray-300">{(item as typeof vehicles[0]).mileage.toLocaleString()} mi</span>
                  </div>
                ) : (
                  <div className="mb-2">
                    <span className="text-gray-600 dark:text-gray-300">{(item as typeof spareParts[0]).category}</span>
                  </div>
                )}
                <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-3">${item.price.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {itemType === 'vehicles' ? (item as typeof vehicles[0]).location : (item as typeof spareParts[0]).condition}
                  </span>
                  <Link
                    to={`/details/${item.id}`}
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
      
      <Footer />
    </div>
  );
};

export default Home;