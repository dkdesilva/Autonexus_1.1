import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navbarClasses = `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
    isScrolled ? 'py-2 glass-effect' : 'py-4 bg-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <ScrollLink
            to="hero"
            spy={true}
            smooth={true}
            offset={-100}
            duration={500}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="flex items-center h-10 w-28 relative">
              <img
                src="src/assets/alogo2.png"
                alt="AutoNexus Logo Light"
                className="absolute top-0 left-0 h-full w-full object-contain transition-opacity duration-300 ease-in-out opacity-100 dark:opacity-0"
              />
              <img
                src="src/assets/alogo1.png"
                alt="AutoNexus Logo Dark"
                className="absolute top-0 left-0 h-full w-full object-contain transition-opacity duration-300 ease-in-out opacity-0 dark:opacity-100"
              />
            </div>
          </ScrollLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
                <ScrollLink
                to="hero"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-1000 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium cursor-pointer"
              >
                Home
              </ScrollLink>
              <ScrollLink
                to="services"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-1000 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium cursor-pointer"
              >
                Services
              </ScrollLink>
              <ScrollLink
                to="vehicles"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-10 00 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium cursor-pointer"
              >
                Vehicles
              </ScrollLink>
              <ScrollLink
                to="spareparts"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-1000 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium cursor-pointer"
              >
                Spareparts
              </ScrollLink>
              <ScrollLink
                to="about"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-1000 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium cursor-pointer"
              >
                About Us
              </ScrollLink>
              <ScrollLink
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-gray-1000 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium cursor-pointer"
              >
                Contact Us
              </ScrollLink>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <RouterLink to="/get-started">
                <Button>Get Started</Button>
              </RouterLink>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect mt-2 py-4">
          <div className="container-custom space-y-4">
            <ScrollLink
              to="services"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
              onClick={closeMenu}
            >
              Services
            </ScrollLink>
            <ScrollLink
              to="vehicles"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
              onClick={closeMenu}
            >
              Vehicles
            </ScrollLink>
            <ScrollLink
              to="spareparts"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
              onClick={closeMenu}
            >
              Spareparts
            </ScrollLink>
            <ScrollLink
              to="about"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
              onClick={closeMenu}
            >
              About Us
            </ScrollLink>
            <RouterLink to="/get-started">
              <Button fullWidth onClick={closeMenu}>
                Get Started
              </Button>
            </RouterLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
