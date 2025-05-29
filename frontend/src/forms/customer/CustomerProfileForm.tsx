import React, { useState } from 'react';
import Button from '../../components/main/ui/Button';

const InputField = ({ label, name, type = 'text', value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

const CustomerProfileForm = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    address: '',
    province: '',
    district: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    birthday: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to update profile.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/customer/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating profile.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">Edit Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
          <InputField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} />
          <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
          <InputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
          <InputField label="Province" name="province" value={formData.province} onChange={handleChange} />
          <InputField label="District" name="district" value={formData.district} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <InputField
            label="Birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4 text-center">
          <Button type="submit" variant="primary" className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfileForm;
