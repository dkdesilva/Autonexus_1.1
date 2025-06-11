import React from 'react';
import { StepProps } from '../create_sparepartsadd_form/spare-types';

const FormStep2: React.FC<StepProps> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const baseSelectClasses = `w-full px-4 py-3 rounded-lg border placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 ease-in-out bg-white dark:bg-gray-700`;

  const getSelectClasses = (field: keyof typeof errors) =>
    `${baseSelectClasses} ${
      errors[field]
        ? 'border-red-500 text-red-700 dark:text-red-400'
        : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
    }`;

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
      <p className="text-gray-600 dark:text-gray-400">Specify the item type and its condition.</p>

      <div className="space-y-4">
        {/* Item Type */}
        <div>
          <Label htmlFor="item_type">Item Type</Label>
          <select
            id="item_type"
            name="item_type"
            value={formData.item_type}
            onChange={handleChange}
            className={getSelectClasses('item_type')}
          >
            <option value="">Select item type</option>
            <option value="Spare Part">Spare Part</option>
          </select>
          <ErrorText field="item_type" />
        </div>

        {/* Item Condition */}
        <div>
          <Label htmlFor="item_condition">Item Condition</Label>
          <select
            id="item_condition"
            name="item_condition"
            value={formData.item_condition}
            onChange={handleChange}
            className={getSelectClasses('item_condition')}
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <ErrorText field="item_condition" />
        </div>
      </div>
    </div>
  );
};

export default FormStep2;
