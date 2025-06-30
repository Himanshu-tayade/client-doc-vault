import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            user && user.role === 'client' ? <ClientDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin"
          element={
            user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
