import React from 'react';
import { StepProps } from '../create_sparepartsadd_form/spare-types';

const FormStep1: React.FC<StepProps> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const baseInputClasses = `w-full px-4 py-3 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`;
  const getInputClasses = (field: keyof typeof errors) =>
    `${baseInputClasses} ${
      errors[field]
        ? 'border-red-500 text-red-700 dark:text-red-400'
        : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white'
    } bg-white dark:bg-gray-700`;

  const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
      {children}
    </label>
  );

  const ErrorText = ({ field }: { field: keyof typeof errors }) =>
    errors[field] ? <p className="mt-1 text-sm text-red-500">{errors[field]}</p> : null;

  return (
    <div className="space-y-6 transition-all duration-300 ease-in-out text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Item Details</h2>
      <p className="text-gray-600 dark:text-gray-400">Please fill in the details below.</p>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={getInputClasses('title')}
            placeholder="Enter the item title"
          />
          <ErrorText field="title" />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className={getInputClasses('description')}
            placeholder="Enter a description"
            rows={4}
          />
          <ErrorText field="description" />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price (LKR) <span className="text-red-500">*</span></Label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            className={getInputClasses('price')}
            placeholder="Enter the price"
            min="0"
            step="0.01"
          />
          <ErrorText field="price" />
        </div>

        {/* Province */}
        <div>
          <Label htmlFor="province">Province</Label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province || ''}
            onChange={handleChange}
            className={getInputClasses('province')}
            placeholder="Enter province"
          />
          <ErrorText field="province" />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city">City</Label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className={getInputClasses('city')}
            placeholder="Enter city"
          />
          <ErrorText field="city" />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleChange}
            className={getInputClasses('phone_number')}
            placeholder="Enter phone number"
          />
          <ErrorText field="phone_number" />
        </div>

        {/* Selling Status */}
        <div>
          <Label htmlFor="selling_status">Selling Status</Label>
          <select
            id="selling_status"
            name="selling_status"
            value={formData.selling_status || 'available'}
            onChange={handleChange}
            className={`${baseInputClasses} border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-700`}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FormStep1;
