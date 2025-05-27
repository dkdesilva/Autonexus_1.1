import React from 'react';
import { Link } from 'react-scroll';
import { ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center pt-16"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-hero-pattern bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1600')"}}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/50 dark:from-gray-900/90 dark:to-gray-900/70"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            The Future of <span className="text-primary-400">Automotive</span> Experience
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            AutoNexus connects you with everything automotive in one place. 
            Buy, sell, maintain, and upgrade your vehicles with our comprehensive platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="get-started"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
            >
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
            >
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <Link
          to="services"
          spy={true}
          smooth={true}
          offset={-80}
          duration={500}
          className="text-white opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
        >
          <ChevronDown size={32} />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;