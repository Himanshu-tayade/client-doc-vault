const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  updateDocument,
  sendManualReminder,
  getAllDocuments 
} = require('../controllers/documentController');

const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);
router.get('/my', authMiddleware, getMyDocuments);
router.delete('/:id', authMiddleware, deleteDocument);
router.put('/:id', authMiddleware, updateDocument);

// Admin-only: View all documents
router.get('/all', authMiddleware, getAllDocuments);

// Admin-only: Send manual reminder
router.post('/remind/:id', authMiddleware, sendManualReminder);

module.exports = router;
