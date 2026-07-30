const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// The admin password lives in .env as plain text for simplicity, but we only
// ever compare it through bcrypt so a login attempt can't be timed to guess it
// character-by-character.
const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'changeme123', 10);

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated.' });
}

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }
  if (!bcrypt.compareSync(password, passwordHash)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  req.session.isAdmin = true;
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

router.get('/status', (req, res) => {
  res.json({ authenticated: Boolean(req.session && req.session.isAdmin) });
});

module.exports = { router, requireAuth };
