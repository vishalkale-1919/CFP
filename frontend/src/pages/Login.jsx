import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(formData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('username', response.data.data.username);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid system auth credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-eco-100">
        <h2 className="text-3xl font-extrabold text-eco-900 text-center mb-2">Welcome Back</h2>
        <p className="text-center text-slate-500 mb-6">Track and minimize your carbon footprint today</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-eco-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-eco-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-eco-600 text-white font-bold py-3 rounded-lg hover:bg-eco-700 transition-colors shadow-md">
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-slate-600 mt-6">
          New here? <Link to="/register" className="text-eco-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}