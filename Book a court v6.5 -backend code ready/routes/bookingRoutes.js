const express = require('express');
const db = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// ============================
// CREATE BOOKING (POST /api/book)
// ============================
router.post('/', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const {
    court_id,
    court_name,
    location,
    booking_date,
    booking_time
  } = req.body;

  console.log('Received booking payload:', {
    userId,
    court_id,
    court_name,
    location,
    booking_date,
    booking_time
  });

  if (
    court_id === undefined || court_id === null ||
    !court_name || !location || !booking_date || !booking_time
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Prevent past date/time
  const bookingDateTime = new Date(`${booking_date}T${booking_time}`);
  const now = new Date();
  if (bookingDateTime < now) {
    return res.status(400).json({ message: 'Booking time cannot be in the past' });
  }

  const sql = `
    INSERT INTO bookings (user_id, court_id, court_name, location, booking_date, booking_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, Number(court_id), court_name, location, booking_date, booking_time],
    (err, result) => {
      if (err) {
        console.error('❌ DB Insert Error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Booking created successfully' });
    }
  );
});

// ============================
// GET ACTIVE BOOKINGS (GET /api/book)
// ============================
router.get('/', requireAuth, (req, res) => {
  const userId = req.session.userId;

  const sql = `
    SELECT id, court_id, court_name, location, booking_date, booking_time
    FROM bookings
    WHERE user_id = ? AND (status IS NULL OR status != 'canceled')
    ORDER BY booking_date DESC, booking_time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ DB Fetch Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ bookings: results });
  });
});

// ============================
// CANCEL BOOKING (PUT /api/book/:id/cancel)
// ============================
router.put('/:id/cancel', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const bookingId = req.params.id;

  const sql = `
    UPDATE bookings
    SET status = 'canceled'
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [bookingId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    res.json({ message: 'Booking canceled successfully' });
  });
});

// ============================
// EDIT BOOKING (PUT /api/book/:id)
// ============================
router.put('/:id', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const bookingId = req.params.id;

  const {
    court_id,
    court_name,
    location,
    booking_date,
    booking_time
  } = req.body;

  if (
    court_id === undefined || court_id === null ||
    !court_name || !location || !booking_date || !booking_time
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Prevent past date/time edits
  const bookingDateTime = new Date(`${booking_date}T${booking_time}`);
  const now = new Date();
  if (bookingDateTime < now) {
    return res.status(400).json({ message: 'Booking time cannot be in the past' });
  }

  const sql = `
    UPDATE bookings
    SET court_id = ?, court_name = ?, location = ?, booking_date = ?, booking_time = ?
    WHERE id = ? AND user_id = ? AND (status IS NULL OR status != 'canceled')
  `;

  db.query(
    sql,
    [court_id, court_name, location, booking_date, booking_time, bookingId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Booking not found or already canceled' });
      }

      res.json({ message: 'Booking updated successfully' });
    }
  );
});

// ============================
// DELETE BOOKING (DELETE /api/book/:id)
// ============================
router.delete('/:id', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const bookingId = req.params.id;

  const sql = `
    DELETE FROM bookings
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [bookingId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    res.json({ message: 'Booking deleted successfully' });
  });
});

// ============================
// GET A BOOKING BY ID (GET /api/book/:id)
// ============================
router.get('/:id', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const bookingId = req.params.id;

  const sql = `
    SELECT id, court_id, court_name, location, booking_date, booking_time
    FROM bookings
    WHERE id = ? AND user_id = ? AND (status IS NULL OR status != 'canceled')
  `;

  db.query(sql, [bookingId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    res.json({ booking: results[0] });
  });
});

// ============================
// GET BOOKINGS WITH FILTERS & PAGINATION
// ============================
router.get('/', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const {
    court_name,
    location,
    from_date,
    to_date,
    page = 1,
    rows = 5
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(rows);
  const limit = parseInt(rows);

  let baseSql = `
    FROM bookings
    WHERE user_id = ? AND (status IS NULL OR status != 'canceled')
  `;

  const params = [userId];

  if (court_name) {
    baseSql += ' AND court_name LIKE ?';
    params.push(`%${court_name}%`);
  }

  if (location) {
    baseSql += ' AND location LIKE ?';
    params.push(`%${location}%`);
  }

  if (from_date) {
    baseSql += ' AND booking_date >= ?';
    params.push(from_date);
  }

  if (to_date) {
    baseSql += ' AND booking_date <= ?';
    params.push(to_date);
  }

  const dataSql = `
    SELECT id, court_id, court_name, location, booking_date, booking_time
    ${baseSql}
    ORDER BY booking_date DESC, booking_time DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `SELECT COUNT(*) AS total ${baseSql}`;

  // Run count query first
  db.query(countSql, params, (err, countResult) => {
    if (err) {
      console.error('❌ Count Query Error:', err);
      return res.status(500).json({ error: err.message });
    }

    const totalCount = countResult[0].total;

    // Then run the paginated query
    db.query(dataSql, [...params, limit, offset], (err, results) => {
      if (err) {
        console.error('❌ Data Fetch Error:', err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ bookings: results, totalCount });
    });
  });
});





module.exports = router;
