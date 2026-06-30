const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db/db');

// GET /register
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('register', { error: null });
});

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.render('register', { error: 'Password must be at least 6 characters.' });
  }
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.render('register', { error: 'An account with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = db.users.insert({ name, email: email.toLowerCase(), passwordHash, createdAt: new Date().toISOString() });

  req.session.userId = user.id;
  res.redirect('/');
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('login', { error: null });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    return res.render('login', { error: 'Invalid email or password.' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.render('login', { error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  const redirectTo = req.session.redirectAfterLogin || '/';
  delete req.session.redirectAfterLogin;
  res.redirect(redirectTo);
});

// POST /logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
