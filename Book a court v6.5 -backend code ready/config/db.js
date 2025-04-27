// =============================
// MySQL Database Connection
// =============================

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // ← change this
  password: '159635741?Ny', // ← change this
  database: 'book_a_court_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

module.exports = db;
