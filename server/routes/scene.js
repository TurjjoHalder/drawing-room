const express = require('express');
const router = express.Router();
const Scene = require('../models/Scene');
const { requireAuth } = require('../middleware/auth');

// GET /api/scene - Load user's scene
router.get('/', requireAuth, async (req, res) => {
  try {
    const scene = await Scene.findOne({ userId: req.session.userId });
    if (!scene) {
      return res.json({ objects: [] });
    }
    res.json({ objects: scene.objects });
  } catch (err) {
    console.error('Load scene error:', err);
    res.status(500).json({ error: 'Failed to load scene.' });
  }
});

// POST /api/scene - Save user's scene
router.post('/', requireAuth, async (req, res) => {
  try {
    const { objects } = req.body;

    if (!Array.isArray(objects)) {
      return res.status(400).json({ error: 'Objects must be an array.' });
    }

    const scene = await Scene.findOneAndUpdate(
      { userId: req.session.userId },
      { userId: req.session.userId, objects, updatedAt: Date.now() },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: 'Scene saved successfully.', objectCount: scene.objects.length });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    console.error('Save scene error:', err);
    res.status(500).json({ error: 'Failed to save scene.' });
  }
});

module.exports = router;
