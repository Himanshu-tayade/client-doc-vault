import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid px-3">
        <h5 className="text-center text-light m-0 fw-bold" style={{ letterSpacing: '1px' }}>
        Whitecircle <span style={{ color: '#f8c102' }}>Vault</span>
      </h5>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {user?.role === 'client' && (
            <p style={{ color: 'white', margin: 0}}>Welcome {user.name} !</p>
          )}
          {user?.role === 'admin' && (
            <p style={{ color: 'white', margin: 0}}>Welcome {user.name} !</p>
          )}
          {user && (
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
