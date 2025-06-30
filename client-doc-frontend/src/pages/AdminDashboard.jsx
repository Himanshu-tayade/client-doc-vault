import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [filters, setFilters] = useState({ type: '', name: '', expiryBefore: '' });
  const [message, setMessage] = useState('');

  const fetchAllDocs = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/documents/all?${query}`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAllDocs();
  };

  const sendReminder = async (id) => {
    try {
      await API.post(`/documents/remind/${id}`);
      setMessage('Reminder sent ✅');
    } catch (err) {
      console.error(err);
      setMessage('Failed to send reminder ❌');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container flex-grow-1 pt-5" style={{ paddingTop: '80px' }}>
        <h2 className="mb-4 mt-4 text-center">🛠️ Admin Dashboard</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleFilterSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Filter by Client Name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="type"
              className="form-control"
              placeholder="Filter by Type"
              value={filters.type}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              name="expiryBefore"
              className="form-control"
              value={filters.expiryBefore}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
          </div>
        </form>

        <div className="row">
          {documents.map((doc) => (
            <div className="col-md-4 mb-3" key={doc._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{doc.name}</h5>
                  <p className="card-text">
                    <strong>Client:</strong> {doc.clientId.name}<br />
                    <strong>Email:</strong> {doc.clientId.email}<br />
                    <strong>Type:</strong> {doc.type}<br />
                    <strong>Expires:</strong> {new Date(doc.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">{doc.description}</p>
                  {doc.fileUrl && (
                    <a
                      href={`http://localhost:5000${doc.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-success me-2"
                    >
                      View
                    </a>
                  )}
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => sendReminder(doc._id)}
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
