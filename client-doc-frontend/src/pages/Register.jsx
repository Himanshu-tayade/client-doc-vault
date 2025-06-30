import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import AuthHeader from '../components/AuthHeader';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/register', form);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <>
    <AuthHeader />
    <div className="d-flex flex-column min-vh-100">
    <div className="container mt-3 flex-grow-1 pt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            placeholder='Enter Name'
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            placeholder='Enter Email'
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            placeholder='Enter Password'
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Register as</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
      <div className="mt-3 text-center">
        <span>Already have an account?</span>{' '}
        <a href="/login" className="btn btn-link p-0 align-baseline">Login</a>
      </div>
    </div>
    <Footer />
    </div>
    </>
  );
};

export default Register;
