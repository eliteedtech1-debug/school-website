const express = require('express');
const { auth } = require('../middleware/auth');
const { WebsiteSection } = require('../models');
const router = express.Router();

// GET /api/content          — list all sections (public, sorted by order)
router.get('/', async (req, res) => {
  try {
    const sections = await WebsiteSection.findAll({
      where: { is_visible: 1 },
      order: [['order_index', 'ASC']],
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/content/all      — list all sections incl. hidden (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const sections = await WebsiteSection.findAll({ order: [['order_index', 'ASC']] });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/content         — create a new section
router.post('/', auth, async (req, res) => {
  try {
    const { title, section_key, order_index, paragraphs, media, is_visible } = req.body;
    const school_id = req.user.school_id || 1; // default school 1 for single-school deploy
    const section = await WebsiteSection.create({
      school_id,
      section_key: section_key || `section_${Date.now()}`,
      title,
      order_index: order_index ?? 0,
      paragraphs: paragraphs || [],
      media: media || [],
      is_visible: is_visible ?? 1,
    });
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/content/:id      — update a section (title, paragraphs, media, visibility, order)
router.put('/:id', auth, async (req, res) => {
  try {
    const section = await WebsiteSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const allowed = ['title', 'section_key', 'order_index', 'is_visible', 'paragraphs', 'media'];
    allowed.forEach(f => { if (req.body[f] !== undefined) section[f] = req.body[f]; });
    await section.save();
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/content/:id   — delete a section
router.delete('/:id', auth, async (req, res) => {
  try {
    const section = await WebsiteSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await section.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/content/reorder  — reorder sections (body: [{ id, order_index }])
router.put('/reorder/bulk', auth, async (req, res) => {
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

module.exports = router;
