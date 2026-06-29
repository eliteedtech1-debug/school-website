const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { auth } = require('../middleware/auth');
const router = express.Router();

const FILE_REPO_URL = process.env.FILE_REPO_URL || 'https://files.eliteedu.tech';
const FILE_REPO_API_KEY = process.env.FILE_REPO_API_KEY || 'your-secret-api-key';

// Use memory storage — no disk writes; pipe buffer straight to file server
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error('Images only (jpeg, jpg, png, gif, webp)'));
  },
});

// POST /api/upload — upload image, return { url, thumbnail_url, public_id }
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const form = new FormData();
    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `website-${Date.now()}${ext}`;

    form.append('file', req.file.buffer, { filename, contentType: req.file.mimetype });

    const response = await axios.post(`${FILE_REPO_URL}/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${FILE_REPO_API_KEY}` },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const { url, filename: savedFilename } = response.data;

    // Thumbnail: same server, append ?w=200 query (or use a /thumb/ prefix if supported)
    const thumbnail_url = `${FILE_REPO_URL}/thumb/${savedFilename}?w=200&h=200&fit=cover`;

    res.json({
      url,
      thumbnail_url,
      public_id: savedFilename.split('.')[0],
    });
  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.error || 'Upload failed' });
  }
});

module.exports = router;
