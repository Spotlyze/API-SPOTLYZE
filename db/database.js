require("dotenv").config();

const mysql = require("mysql2");

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: process.env.DB_HOST , // Host SQL
  user: process.env.DB_USER, // Username SQL
  password: process.env.DB_PASSWORD, // Password SQL
  database: process.env.DB_NAME, // Nama database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Membuat wrapper untuk query async menggunakan pool
const db = pool.promise();

module.exports = db;
