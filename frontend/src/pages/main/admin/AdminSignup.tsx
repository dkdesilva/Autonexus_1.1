// src/components/AdminSignup.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    phone_number: '',
    address: '',
    province: '',
    district: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/signup', form);
      alert('Admin registered!');
      navigate('/admin-signin');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin Signup</h2>

      {['email', 'password', 'phone_number', 'province', 'district'].map(field => (
        <input
          key={field}
          type={field === 'password' ? 'password' : 'text'}
          name={field}
          placeholder={field.replace('_', ' ')}
          value={(form as any)[field]}
          onChange={handleChange}
          required
          className="mb-2 w-full px-3 py-2 border rounded text-black"
        />
      ))}

      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
        className="mb-2 w-full px-3 py-2 border rounded text-black"
      />

      <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
};

export default AdminSignup;
