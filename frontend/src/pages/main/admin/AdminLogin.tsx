import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('token', res.data.token); // Store the JWT
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/admindashboard'); // Redirect after toast
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-2 w-full px-3 py-2 border rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full px-3 py-2 border rounded text-black"
        />
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
