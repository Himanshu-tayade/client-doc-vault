const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const sendReminder = require('../utils/mailer');
const User = require('../models/User');

// Upload Document
exports.uploadDocument = async (req, res) => {
  try {
    const { name, type, description, expiryDate } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newDoc = new Document({
      clientId: req.user.id,
      name,
      type,
      description,
      expiryDate,
      fileUrl,
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// Get My Documents
exports.getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ clientId: req.user.id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

// Delete a Document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.clientId.toString() !== req.user.id)
      return res.status(404).json({ message: 'Document not found or unauthorized' });

    if (doc.fileUrl) {
      const filePath = path.join(__dirname, '..', doc.fileUrl);
      fs.unlink(filePath, (err) => console.log(err || 'File deleted'));
    }

    await doc.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Update a Document (metadata only)
exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.clientId.toString() !== req.user.id)
      return res.status(404).json({ message: 'Document not found or unauthorized' });

    const { name, type, description, expiryDate } = req.body;
    doc.name = name || doc.name;
    doc.type = type || doc.type;
    doc.description = description || doc.description;
    doc.expiryDate = expiryDate || doc.expiryDate;

    await doc.save();
    res.json({ message: 'Document updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// Get all documents
exports.getAllDocuments = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const { type, name, expiryBefore } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (expiryBefore) filter.expiryDate = { $lte: new Date(expiryBefore) };

    const docs = await Document.find(filter).populate('clientId');

    if (name) {
      const nameLower = name.toLowerCase();
      docs = docs.filter((doc) =>
        doc.clientId.name.toLowerCase().includes(nameLower)
      );
    }

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

// Send manual reminder for a document
exports.sendManualReminder = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const doc = await Document.findById(req.params.id).populate('clientId');
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const subject = `📌 Manual Reminder: "${doc.name}" is approaching its deadline`;
    const text = `Hello ${doc.clientId.name},\n\nThis is a manual reminder that your document "${doc.name}" is set to expire on ${doc.expiryDate.toDateString()}.\n\n- Whitecircle Group`;

    await sendReminder(doc.clientId.email, subject, text);
    res.json({ message: 'Reminder sent manually' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reminder' });
  }
};