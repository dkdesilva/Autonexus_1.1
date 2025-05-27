import React from 'react';
import { Link } from 'react-router-dom';
import { getStartedOptions } from '../../../data/main/mockData';

const GetStartedSection: React.FC = () => {
  return (
    <section id="get-started" className="section-padding">
      <div className="container-custom">
        <div className="section-title text-center">
          <h2 className="text-3xl font-bold">Get Started with AutoNexus</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select how you'd like to use our platform
          </p>
        </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {getStartedOptions.map((option, index) => (
                    <Link
                      key={option.id}
                      to={option.link}
                      state={{ userType: option.id }}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="p-8 flex flex-col items-center text-center h-full">
                        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 dark:group-hover:bg-blue-700 transition-colors duration-200">
                          {option.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{option.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{option.description}</p>
                        <div className="mt-auto">
                          <span className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 dark:border-blue-400 rounded-lg font-medium text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-colors duration-200">
                            Select
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
