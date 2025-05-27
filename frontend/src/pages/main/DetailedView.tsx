import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Button from '../../components/main/ui/Button';
import { vehicles, spareParts } from '../../data/main/mockData';

const DetailedView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Determine if this is a vehicle or spare part based on ID
  const isVehicle = id && parseInt(id) < 100;
  
  // Find the item by ID
  const item = isVehicle 
    ? vehicles.find(v => v.id === parseInt(id || '0')) 
    : spareParts.find(p => p.id === parseInt(id || '0'));
  
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Item Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Link to="/home">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Cast to appropriate type for TypeScript
  const vehicleItem = isVehicle ? (item as typeof vehicles[0]) : null;
  const partItem = !isVehicle ? (item as typeof spareParts[0]) : null;
  
  const nextImage = () => {
    setActiveImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Breadcrumb navigation */}
        <nav className="mb-8 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Home</Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <Link to={isVehicle ? "/vehicles" : "/spare-parts"} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            {isVehicle ? "Vehicles" : "Spare Parts"}
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.title}</span>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-12 animate-fade-in">
          {/* Image Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 overflow-hidden">
            <div className="relative h-80 sm:h-96 md:h-[30rem] overflow-hidden rounded-xl mb-4">
              <img 
                src={item.images[activeImageIndex]} 
                alt={`${item.title} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={prevImage}
                className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/80 flex items-center justify-center text-gray-900 dark:text-white hover:bg-white hover:dark:bg-gray-900 transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/80 flex items-center justify-center text-gray-900 dark:text-white hover:bg-white hover:dark:bg-gray-900 transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all duration-200 ${
                    activeImageIndex === index 
                      ? 'ring-2 ring-blue-600 dark:ring-blue-400' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Details */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
              
              {item.seller.verified && (
                <div className="flex items-center text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Verified Seller
                </div>
              )}
            </div>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(item.seller.rating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : i < item.seller.rating 
                          ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                          : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{item.seller.rating} rating</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-600 dark:text-gray-300">Sold by {item.seller.name}</span>
            </div>
            
            <div className="mt-6">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${item.price.toLocaleString()}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-8">
              {isVehicle && vehicleItem ? (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Brand</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{vehicleItem.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{vehicleItem.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mileage</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{vehicleItem.mileage.toLocaleString()} miles</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                    <p className="text-lg text-gray-900 dark:text-white capitalize">{vehicleItem.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Condition</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{vehicleItem.condition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{vehicleItem.location}</p>
                  </div>
                </>
              ) : partItem && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{partItem.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Condition</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{partItem.condition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty</h3>
                    <p className="text-lg text-gray-900 dark:text-white">{partItem.warranty}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Compatible With</h3>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {partItem.compatible.join(', ')}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {item.description}
              </p>
            </div>
            
            <div className="mt-10 space-y-4">
              <Button 
                variant="primary" 
                fullWidth
                className="py-3"
              >
                Contact Seller
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                className="py-3"
              >
                {isVehicle ? 'Schedule a Test Drive' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DetailedView;