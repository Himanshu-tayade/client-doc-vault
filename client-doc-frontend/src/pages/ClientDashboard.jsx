import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ClientDashboard = () => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    expiryDate: ''
  });
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');
  const [editingDoc, setEditingDoc] = useState(null);  // Current doc being edited
  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    description: '',
    expiryDate: ''
  });


  // 🔄 Load user's documents
  const fetchDocuments = async () => {
    try {
      const res = await API.get('/documents/my');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 📤 Upload document
  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('description', form.description);
    formData.append('expiryDate', form.expiryDate);
    formData.append('file', file);

    try {
      await API.post('/documents/upload', formData);
      setMessage('Document uploaded successfully ✅');
      setForm({ name: '', type: '', description: '', expiryDate: '' });
      setFile(null);
      fetchDocuments(); // reload
    } catch (err) {
      setMessage('Upload failed ❌');
    }
  };

  // ❌ Delete document
  const handleDelete = async (id) => {
    try {
      await API.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setEditForm({
      name: doc.name,
      type: doc.type,
      description: doc.description,
      expiryDate: doc.expiryDate?.substring(0, 10) // Trim to yyyy-mm-dd
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/documents/${editingDoc._id}`, editForm);
      setEditingDoc(null);
      fetchDocuments();  // Refresh
      setMessage('Document updated successfully ✅');
    } catch (err) {
      setMessage('Update failed ❌');
    }
  };


  return (
    <>
    <Navbar />  
    <div className="container mt-3" style={{ paddingTop: '80px' }}>
      <h2 className="mb-6 text-center">📄 Client Dashboard</h2>
      <br />
      {message && <div className="alert alert-info">{message}</div>}
      <h4 className="offset-3 mb-4">Add Document</h4>
      <form onSubmit={handleUpload} className="mb-5  ">
        <div className="row col-6 offset-3 mb-3"> 
          <div className="col-md-6 mb-3">
            <label for="name" class="form-label">Document Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Document Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label for="type" class="form-label">Document Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              placeholder="e.g., ID, Report, image"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              placeholder="Enter Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="col-md-6 mb-3">
            <label for="expiryDate" class="form-label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              className="form-control"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label for="file" class="form-label">Choose File</label>
            <input
              type="file"
              name="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-50 offset-3">
          Upload Document
        </button>
      </form>
      <hr />
      <h4 className="mb-3 mt-4">Your Documents</h4>
      <div className="row">
        {documents.map((doc) => (
          <div className="col-md-4 mb-3" key={doc._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{doc.name}</h5>
                <p className="card-text">
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
                  onClick={() => openEditModal(doc)}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(doc._id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {editingDoc && (
  <div className="modal show fade d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <form onSubmit={submitEdit}>
          <div className="modal-header">
            <h5 className="modal-title">Edit Document</h5>
            <button type="button" className="btn-close" onClick={() => setEditingDoc(null)}></button>
          </div>
          <div className="modal-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Type</label>
              <input type="text" className="form-control" value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} required />
            </div>
            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Expiry Date</label>
              <input type="date" className="form-control" value={editForm.expiryDate}
                onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setEditingDoc(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    <Footer />
    </>
  );
};

export default ClientDashboard;
