import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const AboutSection: React.FC = () => {
  const benefits = [
    "Access to thousands of verified vehicles",
    "Connect with certified garages and mechanics",
    "Find genuine parts at competitive prices",
    "Seamless buying and selling experience",
    "Verified dealer network across the country",
    "Personalized automotive recommendations",
  ];

  return (
    <section id="about" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">About AutoNexus</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Founded in 2023, AutoNexus was created with a simple mission: to make everything automotive accessible in one place. We've built a platform that connects car buyers, sellers, repair shops, and parts dealers in a seamless ecosystem.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Whether you're looking to buy your first car, sell your current vehicle, find a trusted mechanic, or source specific parts, AutoNexus provides the tools and connections you need to make informed decisions.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-2"
                >
                  <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-xl overflow-hidden"
          >
            <img 
              src="https://images.pexels.com/photos/3807316/pexels-photo-3807316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="AutoNexus Team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6">
                <div className="text-white text-lg font-semibold mb-2">Our Team</div>
                <p className="text-gray-200">
                  A passionate group of automotive enthusiasts and tech innovators working to transform the industry
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;