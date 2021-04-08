const mysql = require('mysql');

// Connect to the SQL database
// var database;
// function connect(){
//   database = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
//   });
//   database.connect((err) => {
//     if (err) throw err;
//     console.log(`Connected to MySQL database at '${process.env.DB_HOST}:${process.env.DB_PORT}' as user '${process.env.DB_USER}'`);
//   });
//   database.on('error', err => {
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//         connect();
//     } else {
//         throw err;
//     }
//   });
// }

// connect();

// Connection Pool
var dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  connectionLimit: 50,
  queueLimit: 0,
  waitForConnection: true
};
var database = mysql.createPool(dbConfig);
database.getConnection((err,conn)=>{
  if(err) throw err;
  conn.ping((err2) => {
    conn.release();
    if (err2) {
      throw err2;
    } else {
      console.log(`Connected to MySQL database at '${process.env.DB_HOST}:${process.env.DB_PORT}' as user '${process.env.DB_USER}'`)
    }
  });
});

module.exports = database;