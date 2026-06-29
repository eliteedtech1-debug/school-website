const express = require('express');
const { auth } = require('../middleware/auth');
const { WebsiteSection } = require('../models');
const router = express.Router();

// GET /api/website-sections?school_id=X — public list
router.get('/', async (req, res) => {
  try {
    const { school_id } = req.query;
    if (!school_id) return res.status(400).json({ message: 'school_id required' });
    
    const sections = await WebsiteSection.findAll({
      where: { school_id },
      order: [['order_index', 'ASC']],
    });
    res.json({ data: sections });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/website-sections/:school_id — list by school (alternative route)
router.get('/:school_id', async (req, res) => {
  try {
    const sections = await WebsiteSection.findAll({
      where: { school_id: req.params.school_id },
      order: [['order_index', 'ASC']],
    });
    res.json({ data: sections });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/website-sections/:school_id — create section
router.post('/:school_id', auth, async (req, res) => {
  try {
    const section = await WebsiteSection.create({
      school_id: req.params.school_id,
      section_key: req.body.section_key || `section_${Date.now()}`,
      title: req.body.title,
      order_index: req.body.order_index ?? 0,
      paragraphs: JSON.stringify(req.body.paragraphs || []),
      media: JSON.stringify(req.body.media || []),
      is_visible: req.body.is_visible ?? 1,
    });
    res.status(201).json({ data: section });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/website-sections/:school_id/:id — update section
router.put('/:school_id/:id', auth, async (req, res) => {
  try {
    const section = await WebsiteSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    
    if (req.body.title !== undefined) section.title = req.body.title;
    if (req.body.section_key !== undefined) section.section_key = req.body.section_key;
    if (req.body.order_index !== undefined) section.order_index = req.body.order_index;
    if (req.body.is_visible !== undefined) section.is_visible = req.body.is_visible;
    if (req.body.paragraphs !== undefined) section.paragraphs = JSON.stringify(req.body.paragraphs);
    if (req.body.media !== undefined) section.media = JSON.stringify(req.body.media);
    
    await section.save();
    res.json({ data: section });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/website-sections/:school_id/reorder — bulk reorder
router.put('/:school_id/reorder', auth, async (req, res) => {
  try {
    await Promise.all(
      req.body.map(({ id, order_index }) =>
        WebsiteSection.update({ order_index }, { where: { id } })
      )
    );
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/website-sections/:school_id/:id — delete section
router.delete('/:school_id/:id', auth, async (req, res) => {
  try {
    const section = await WebsiteSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await section.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
