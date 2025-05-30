import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const serviceTypes = [
  'All in One',
  'Oil Change & Basic Maintenance',
  'Brake Services',
  'Engine Diagnostics & Repair',
  'Tire & Wheel Services',
];

const openingHoursOptions = [
  '8:00 AM – 6:00 PM',
  '8:00 AM – 2:00 PM',
  '8:00 AM – 12:00 PM',
  '7:00 AM – 9:00 PM',
];

const openingDaysOptions = [
  '7 Days (Mon–Sun)',
  '6 Days (Mon–Sat)',
  '5 Days (Mon–Fri)',
  'Weekends Only',
];

const GarageProfileForm: React.FC = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    address: '',
    province: '',
    district: '',
    company_name: '',
    service_type: '',
    description: '',
    founded_year: '',
    owner_name: '',
    opening_days: '',
    opening_hours: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authorized. Please sign in again.');
        return;
      }

      const res = await axios.put(`${API_BASE}/api/garage/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message || 'Profile updated successfully.');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Update Garage Profile</h2>

      {message && <p className="mb-4 text-green-600 dark:text-green-400">{message}</p>}
      {error && <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="province"
          placeholder="Province"
          value={formData.province}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          name="service_type"
          value={formData.service_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Service Type</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <input
          name="founded_year"
          placeholder="Founded Year"
          type="number"
          value={formData.founded_year}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1800"
          max={new Date().getFullYear()}
        />
        <input
          name="owner_name"
          placeholder="Owner Name"
          value={formData.owner_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="opening_days"
          value={formData.opening_days}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Opening Days</option>
          {openingDaysOptions.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          name="opening_hours"
          value={formData.opening_hours}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Opening Hours</option>
          {openingHoursOptions.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default GarageProfileForm;
