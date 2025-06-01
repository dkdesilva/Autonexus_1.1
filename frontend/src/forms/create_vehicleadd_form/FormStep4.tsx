import React from 'react';
import { StepProps } from '../create_vehicleadd_form/types';

const FormStep4: React.FC<StepProps> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className="space-y-6 transition-all duration-300 ease-in-out text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Details</h2>
      <p className="text-gray-600 dark:text-gray-400">Provide detailed information about your vehicle.</p>

      <div className="space-y-4">
        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            className={`w-full px-4 py-2 rounded-lg border placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              bg-white dark:bg-gray-700
              ${
                errors.brand
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'border-gray-300 text-gray-900 dark:text-white'
              }
              transition-colors
            `}
          />
          {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Red"
            className={`w-full px-4 py-2 rounded-lg border placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              bg-white dark:bg-gray-700
              ${
                errors.color
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'border-gray-300 text-gray-900 dark:text-white'
              }
              transition-colors
            `}
          />
          {errors.color && <p className="text-sm text-red-500 mt-1">{errors.color}</p>}
        </div>

        {/* Made Year */}
        <div>
          <label htmlFor="made_year" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Made Year
          </label>
          <input
            type="number"
            id="made_year"
            name="made_year"
            value={formData.made_year}
            onChange={handleChange}
            placeholder="e.g. 2020"
            className={`w-full px-4 py-2 rounded-lg border placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              bg-white dark:bg-gray-700
              ${
                errors.made_year
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'border-gray-300 text-gray-900 dark:text-white'
              }
              transition-colors
            `}
          />
          {errors.made_year && <p className="text-sm text-red-500 mt-1">{errors.made_year}</p>}
        </div>

        {/* Mileage */}
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Mileage (in km)
          </label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="e.g. 45000"
            className={`w-full px-4 py-2 rounded-lg border placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              bg-white dark:bg-gray-700
              ${
                errors.mileage
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'border-gray-300 text-gray-900 dark:text-white'
              }
              transition-colors
            `}
          />
          {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage}</p>}
        </div>

        {/* Fuel Type */}
        <div>
          <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Fuel Type
          </label>
    <select
            id="fuel_type"
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.fuel_type ? 'border-red-500 text-red-700 dark:text-red-400' : 'border-gray-300'
              }
              transition-colors
            `}
          >
            <option value="" disabled>
              Select Fuel Type
            </option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.fuel_type && <p className="text-sm text-red-500 mt-1">{errors.fuel_type}</p>}
        </div>

        {/* Transmission */}
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Transmission
          </label>
<select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.transmission ? 'border-red-500 text-red-700 dark:text-red-400' : 'border-gray-300'
              }
              transition-colors
            `}
          >
            <option value="" disabled>
              Select Transmission
            </option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          {errors.transmission && <p className="text-sm text-red-500 mt-1">{errors.transmission}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormStep4;
