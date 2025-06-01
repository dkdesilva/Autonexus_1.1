import React from 'react';
import { StepProps } from '../create_sparepartsadd_form/spare-types';

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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Spare Part Details</h2>
      <p className="text-gray-600 dark:text-gray-400">Provide detailed information about the spare part.</p>

      <div className="space-y-4">
        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium mb-1">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Bosch"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700
              ${errors.brand ? 'border-red-500' : 'border-gray-300'}
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium mb-1">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Black"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700
              ${errors.color ? 'border-red-500' : 'border-gray-300'}
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.color && <p className="text-sm text-red-500 mt-1">{errors.color}</p>}
        </div>

        {/* Material */}
        <div>
          <label htmlFor="material" className="block text-sm font-medium mb-1">Material</label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
            placeholder="e.g. Steel"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700
              ${errors.material ? 'border-red-500' : 'border-gray-300'}
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.material && <p className="text-sm text-red-500 mt-1">{errors.material}</p>}
        </div>

        {/* Model Compatibility */}
        <div>
          <label htmlFor="model_compatibility" className="block text-sm font-medium mb-1">Model Compatibility</label>
          <input
            type="text"
            id="model_compatibility"
            name="model_compatibility"
            value={formData.model_compatibility}
            onChange={handleChange}
            placeholder="e.g. Toyota Corolla, Honda Civic"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700
              ${errors.model_compatibility ? 'border-red-500' : 'border-gray-300'}
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.model_compatibility && <p className="text-sm text-red-500 mt-1">{errors.model_compatibility}</p>}
        </div>

        {/* Made Year */}
        <div>
          <label htmlFor="made_year" className="block text-sm font-medium mb-1">Made Year</label>
          <input
            type="number"
            id="made_year"
            name="made_year"
            value={formData.made_year}
            onChange={handleChange}
            placeholder="e.g. 2022"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700
              ${errors.made_year ? 'border-red-500' : 'border-gray-300'}
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.made_year && <p className="text-sm text-red-500 mt-1">{errors.made_year}</p>}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 10"
            min={1}
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700
              ${errors.quantity ? 'border-red-500' : 'border-gray-300'}
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormStep4;
