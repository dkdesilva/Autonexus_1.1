import React, { useEffect } from 'react';
import { StepProps } from '../create_vehicleadd_form/types';

const FormStep1: React.FC<StepProps> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  useEffect(() => {
  setFormData(prev => ({ ...prev, selling_status: 'available' }));
  }, []);

  return (
    <div className="space-y-6 transition-all duration-300 ease-in-out text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Item Details</h2>
      <p className="text-gray-600 dark:text-gray-400">Please fill in the details below.</p>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.title
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }
              bg-white dark:bg-gray-700
              transition-colors
            `}
            placeholder="Enter the item title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.description
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }
              bg-white dark:bg-gray-700
              transition-colors
            `}
            placeholder="Enter a description"
            rows={4}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Price (LKR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.price
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }
              bg-white dark:bg-gray-700
              transition-colors
            `}
            placeholder="Enter the price"
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>

        {/* Province */}
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Province
          </label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.province
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }
              bg-white dark:bg-gray-700
              transition-colors
            `}
            placeholder="Enter province"
          />
          {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.city
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }
              bg-white dark:bg-gray-700
              transition-colors
            `}
            placeholder="Enter city"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.phone_number
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }
              bg-white dark:bg-gray-700
              transition-colors
            `}
            placeholder="Enter phone number"
          />
          {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>}
        </div>

        {/* Selling Status */}
        <div>
          <label
            htmlFor="selling_status"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Selling Status
          </label>
          <select
            id="selling_status"
            name="selling_status"
            value="available"
            disabled
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 cursor-not-allowed
            `}
          >
            <option value="available">Available</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FormStep1;
