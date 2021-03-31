const mysql = require('mysql');

// Connect to the SQL database
var database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

database.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL database at '${process.env.DB_HOST}:${process.env.DB_PORT}' as user '${process.env.DB_USER}'`);
});

database.on('error', err => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      database = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
      });
      database.connect(err2=>{
        if (err2) throw err2;
        console.log(`Reconnected to MySQL database.`)
      });
  } else {
      throw err;
  }
});

module.exports = database;