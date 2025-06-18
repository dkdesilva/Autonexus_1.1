import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import Button from '../../../components/main/ui/Button';// adjust the path based on your project structure

const ContactUsSection: React.FC = () => {
  return (
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
  );
};

export default ContactUsSection;