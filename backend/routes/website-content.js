const express = require('express');
const { auth } = require('../middleware/auth');
const { WebsiteContent } = require('../models');
const router = express.Router();

// GET /api/website-content?school_id=X — public get
router.get('/', async (req, res) => {
  try {
    const { school_id } = req.query;
    if (!school_id) return res.status(400).json({ message: 'school_id required' });
    
    let content = await WebsiteContent.findOne({ where: { school_id } });
    if (!content) {
      // Create empty content for this school
      content = await WebsiteContent.create({ school_id });
    }
    res.json({ data: content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/website-content?school_id=X — upsert content
router.post('/', async (req, res) => {
  try {
    const { school_id } = req.query;
    if (!school_id) return res.status(400).json({ message: 'school_id required' });
    
    const [content, created] = await WebsiteContent.upsert({
      school_id,
      ...req.body,
    }, { returning: true });
    
    res.json({ data: content, created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
