const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const requireAuth = require('../middleware/authMiddleware'); // ✅ Secure middleware import

const router = express.Router();

// ===================
// REGISTER
// ===================
router.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)';
    db.query(sql, [full_name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// ===================
// LOGIN
// ===================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ message: 'Login successful', user: { id: user.id, full_name: user.full_name } });
  });
});

// ===================
// LOGOUT
// ===================
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// ===================
// GET PROFILE (Secure)
// ===================
router.get('/profile', requireAuth, (req, res) => {
  const userId = req.session.userId;

  db.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ user: results[0] });
  });
});

// ===================
// UPDATE PROFILE (Secure)
// ===================
router.put('/profile', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const { full_name, email, password } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ message: 'Full name and email are required' });
  }

  let updateQuery = 'UPDATE users SET full_name = ?, email = ?';
  let queryParams = [full_name, email];

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateQuery += ', password_hash = ?';
    queryParams.push(hashedPassword);
  }

  updateQuery += ' WHERE id = ?';
  queryParams.push(userId);

  db.query(updateQuery, queryParams, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profile updated successfully' });
  });
});

module.exports = router;
