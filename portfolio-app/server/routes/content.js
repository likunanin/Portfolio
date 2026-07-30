const express = require('express');
const { readContent, writeContent } = require('../contentStore');
const { requireAuth } = require('./auth');

const router = express.Router();

// Anyone can read the content — this is what the public site renders.
router.get('/', (req, res) => {
  try {
    res.json(readContent());
  } catch (err) {
    res.status(500).json({ error: 'Could not read content.' });
  }
});

// Only a logged-in admin can overwrite it.
router.put('/', requireAuth, async (req, res) => {
  try {
    await writeContent(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Could not save content.' });
  }
});

module.exports = router;
