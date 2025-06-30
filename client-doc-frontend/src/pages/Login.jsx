import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import AuthHeader from '../components/AuthHeader';


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;

      // Save token + user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = user.role === 'admin' ? '/admin' : '/dashboard';

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <>
    <AuthHeader />
    <div className="d-flex flex-column min-vh-100">
    <div className="container mt-5 flex-grow-1 pt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="btn btn-success w-100">
          Login
        </button>
      </form>
      <div className="mt-3 text-center">
        <span>Don't have an account?</span>{' '}
        <a href="/register" className="btn btn-link p-0 align-baseline">Register</a>
      </div>
    </div>
    <Footer />
    </div>
    </>
  );
};

export default Login;
