import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, Cog, Store } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import { services } from '../../../data/landing/services';

const icons = {
  car: Car,
  wrench: Wrench,
  cog: Cog,
  store: Store,
};

const ServicesSection: React.FC = () => {
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

  return (
    <section id="services" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="section-title">
          <h2>Our Services</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need for your automotive journey in one platform
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => {
            const IconComponent = icons[service.icon as keyof typeof icons];
            
            return (
              <motion.div key={service.id} variants={item}>
                <Card className="h-full">
                  <CardContent className="h-full flex flex-col">
                    <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg w-14 h-14 flex items-center justify-center">
                      <IconComponent size={28} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 flex-grow">{service.description}</p>
                    <div className="mt-4">
                      <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;