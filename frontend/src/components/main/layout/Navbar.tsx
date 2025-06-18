import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Car,
  Wrench,
  Cog,
  Building,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../../contexts/main/ThemeContext';
import axios from 'axios';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error('User fetch error:', err));
  }, []);

  const navLinks = [
    { name: 'Home', path: '/main-land', icon: <Car className="w-5 h-5" /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Car className="w-5 h-5" /> },
    { name: 'Spare Parts', path: '/spare-parts', icon: <Cog className="w-5 h-5" /> },
    { name: 'Garages', path: '/garages', icon: <Wrench className="w-5 h-5" /> },
    { name: 'Dealerships', path: '/dealerships', icon: <Building className="w-5 h-5" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
  isScrolled
    ? 'backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md border-b border-gray-300 dark:border-gray-700 py-2'
    : 'bg-transparent py-4'
}`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl px-2 sm:px-4 lg:px-6 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center h-10 w-28 relative">
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-4 space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 mr-4"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  to={
                    user.user_type === 'customer'
                      ? '/customer-profile'
                      : user.user_type === 'garage'
                      ? '/garage-profile'
                      : user.user_type === 'dealership'
                      ? '/dealership-profile'
                      : user.user_type === 'sparepart'
                      ? '/sparepart-profile'
                      : '/get-started'
                  }
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <img
                    src={
                      user.profileImage ||
                      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                  />
                  <span className="text-sm font-medium dark:text-white">{user.user_type}</span>
                </Link>
              )}
            </div>

            <Link
              to="/get-started"
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 ml-4"
            >
              Logout
            </Link>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect mt-2 py-4 bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === link.path
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={closeMenu}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            <Link
              to="/get-started"
              className="block w-full text-center mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
