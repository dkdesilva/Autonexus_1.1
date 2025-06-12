import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Shield, Star, Users, Car, GalleryVerticalEnd, Wrench, Building, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Card from '../../components/main/ui/Card';
import Button from '../../components/main/ui/Button';
import { serviceCards } from '../../data/main/mockData';
import LandingPageVehicles from './LandingPageVehicles';
import LandingPageSpareParts from './LandingPageSpareParts';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 animate-slide-up">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Your One-Stop <span className="text-blue-600 dark:text-blue-400">Automotive</span> Marketplace
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Buy and sell vehicles, find parts, locate garages, and connect with dealerships - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/get-started">
                <Button size="lg" variant="primary" icon={<ChevronRight className="h-5 w-5" />}>
                  Get Started
                </Button>
              </Link>
              <Link to="/vehicles">
                <Button size="lg" variant="outline" icon={<Search className="h-5 w-5" />}>
                  Browse Vehicles
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10 animate-slide-in-right">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full opacity-30 filter blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full opacity-30 filter blur-3xl"></div>
              <img 
                src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Luxury car" 
                className="relative rounded-2xl shadow-2xl w-full object-cover max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Vehicles', icon: <Car className="h-6 w-6 text-blue-500" /> },
              { value: '5K+', label: 'Parts', icon: <GalleryVerticalEnd className="h-6 w-6 text-blue-500" /> },
              { value: '1K+', label: 'Garages', icon: <Wrench className="h-6 w-6 text-blue-500" /> },
              { value: '500+', label: 'Dealerships', icon: <Building className="h-6 w-6 text-blue-500" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About AutoNexus</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              AutoNexus was founded with a simple mission: to create a seamless platform connecting all aspects of the automotive world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Shield className="h-12 w-12 text-blue-600" />,
                title: 'Trusted Platform',
                description: 'Every seller is verified and rated by our community to ensure safe, secure transactions.'
              },
              {
                icon: <Users className="h-12 w-12 text-blue-600" />,
                title: 'Community Driven',
                description: 'Join thousands of automotive enthusiasts sharing insights and experiences.'
              },
              {
                icon: <Star className="h-12 w-12 text-blue-600" />,
                title: 'Quality Assurance',
                description: 'All listings undergo a verification process to ensure accurate information and fair pricing.'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              We offer a comprehensive range of services to meet all your automotive needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCards.map((service, index) => (
              <Card 
                key={service.id}
                className="h-full animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                hoverEffect={true}
                onClick={() => window.location.href = service.link}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <Link
                    to={service.link}
                    className="mt-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
                  >
                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Vehicles Section */}
      <LandingPageVehicles />
      <LandingPageSpareParts />
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <div className="w-24 h-1 bg-blue-600 mb-8"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">123 Auto Avenue, Drive City, DC 10001</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">contact@autonexus.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <form className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your email"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button variant="primary" fullWidth>Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;