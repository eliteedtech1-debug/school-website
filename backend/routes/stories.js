const express = require('express');
const { Story } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stories = await Story.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(stories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const stories = await Story.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(stories);
  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, imageUrl, type, order } = req.body;
    const story = await Story.create({
      title,
      description,
      imageUrl,
      type: type || 'image',
      order: order || 0,
      isActive: true
    });
    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const { title, description, imageUrl, type, order, isActive } = req.body;
    await story.update({ title, description, imageUrl, type, order, isActive });
    res.json(story);
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    await story.destroy();
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
