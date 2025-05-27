import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Car, Wrench, Cog, Building, MessageSquare, Menu, X, Sun, Moon,
} from 'lucide-react';
import { useTheme } from '../../../contexts/main/ThemeContext';
import axios from 'axios';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const getStoredToken = () =>
    localStorage.getItem('token') || sessionStorage.getItem('token');

  const fetchUser = async () => {
    const token = getStoredToken();

    if (!token) {
      navigate('/get-started');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const userRes = await axios.get('http://localhost:5000/api/user', { headers });
      setUser(userRes.data);

      const imageRes = await axios.get('http://localhost:5000/api/customer/profile-image', {
        headers,
      });
      setProfileImage(`http://localhost:5000/images/${imageRes.data.profile_picture}`);
    } catch (err) {
      console.error('Error fetching user or profile image:', err);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      navigate('/get-started');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/get-started');
  };

  const navLinks = [
    { name: 'Home', path: '/main-land', icon: <Car className="w-5 h-5" /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Car className="w-5 h-5" /> },
    { name: 'Spare Parts', path: '/spare-parts', icon: <Cog className="w-5 h-5" /> },
    { name: 'Garages', path: '/garages', icon: <Wrench className="w-5 h-5" /> },
    { name: 'Dealerships', path: '/dealerships', icon: <Building className="w-5 h-5" /> },
    { name: 'Contact Us', path: '/contact', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full bg-white dark:bg-gray-900 shadow-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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

          <div className="hidden md:flex ml-10 space-x-4">
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

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 mr-4"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user && (
              <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                <img
                  src={
                    profileImage ||
                    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                />
                <span className="text-sm font-medium dark:text-white">Hi {user.username}!</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 ml-4"
            >
              Logout
            </button>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Open menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                location.pathname === link.path
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </Link>
          ))}

          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-center mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
