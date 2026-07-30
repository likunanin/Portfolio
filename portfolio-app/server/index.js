require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const { router: authRouter } = require('./routes/auth');
const contentRouter = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8 // 8 hour login
  }
}));

// API
app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);

// Public portfolio site
app.use(express.static(path.join(__dirname, '..', 'public')));

// Admin panel (the page itself just holds a login form + dashboard;
// the actual protection happens on the /api/content PUT route)
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  console.log(`Admin panel at        http://localhost:${PORT}/admin`);
});
