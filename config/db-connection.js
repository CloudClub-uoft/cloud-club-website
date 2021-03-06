const path = require('path');
const mysql = require('mysql');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Connect to the SQL database
const database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

database.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = database;
