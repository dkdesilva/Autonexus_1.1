import React from 'react';
import { StepProps } from '../create_vehicleadd_form/types';

const FormStep2: React.FC<StepProps> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Item Details</h2>
      <p className="text-gray-600 dark:text-gray-400">Specify the item type and its condition.</p>

      <div className="space-y-4">
        {/* Item Type */}
        <div>
          <label
            htmlFor="item_type"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Item Type
          </label>
          <select
            id="item_type"
            name="item_type"
            value={formData.item_type}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border 
              placeholder-gray-400 dark:placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              transition-colors duration-200 ease-in-out
              bg-white dark:bg-gray-700
              ${
                errors.item_type
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
              }
            `}
          >
            <option value="">Select item type</option>
            <option value="Vehicle">Vehicle</option>
          </select>
          {errors.item_type && (
            <p className="mt-1 text-sm text-red-500">{errors.item_type}</p>
          )}
        </div>

        {/* Item Condition */}
        <div>
          <label
            htmlFor="item_condition"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
          >
            Item Condition
          </label>
          <select
            id="item_condition"
            name="item_condition"
            value={formData.item_condition}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border 
              placeholder-gray-400 dark:placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              transition-colors duration-200 ease-in-out
              bg-white dark:bg-gray-700
              ${
                errors.item_condition
                  ? 'border-red-500 text-red-700 dark:text-red-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
              }
            `}
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          {errors.item_condition && (
            <p className="mt-1 text-sm text-red-500">{errors.item_condition}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStep2;
