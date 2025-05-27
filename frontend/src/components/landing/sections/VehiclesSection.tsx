import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { vehicles } from '../../../data/landing/vehicles';

const VehiclesSection: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="vehicles" className="section-padding">
      <div className="container-custom">
        <div className="section-title">
          <h2>Featured Vehicles</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover top-rated vehicles ready for you to explore
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {vehicles.map((vehicle) => (
            <motion.div 
              key={vehicle.id}
              variants={item}
              onMouseEnter={() => setHoveredId(vehicle.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    {vehicle.type}
                  </div>
                </div>
                <CardContent>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                    <p className="text-lg font-bold text-primary-600">{formatPrice(vehicle.price)}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.year} • {vehicle.mileage.toLocaleString()} miles
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Button fullWidth>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VehiclesSection;
