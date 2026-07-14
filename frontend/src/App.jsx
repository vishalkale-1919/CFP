import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';

// Protected Route Component to enforce JWT login context
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}