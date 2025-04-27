// =============================
// Book a Court - Backend Server
// =============================

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const db = require('./config/db'); // MySQL connection setup

require('dotenv').config(); // Load environment variables

const app = express();

// =======================
// Middleware Configuration
// =======================

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// =======================
// Route Registration ✅
// =======================
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // ✅ New import

app.use('/api', authRoutes);
app.use('/api/book', bookingRoutes); // ✅ Booking routes

// =======================
// Test Route
// =======================
app.get('/', (req, res) => {
  res.send('🏟️ Book a Court Backend Running');
});

// =======================
// Server Start
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
