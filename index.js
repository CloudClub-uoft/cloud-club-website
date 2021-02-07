// Packages
require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

// Configuration
const port = process.env.PORT || 80;

// bcrypt settings
const saltRounds = process.env.ENC_ROUNDS;

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

// Configure Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on('error', (err) => {
  console.log(`Redis connection failed: ${err}`);
});
redisClient.on('connect', () => {
  console.log('Connected to Redis database');
});

// Conncet to Redis database
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.REDIS_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Dynamic Routes
app.get('/', (req, res) => {
  const sesh = req.session;
  if (sesh.email) {
    return res.render('index', { email: sesh.email });
  }
  return res.render('index', { email: false });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Member list GET request
app.get('/members', (req, res) => {
  database.query('SELECT * FROM `clubmembers`', (err, result) => {
    if (err) res.status(500).json({ Error: 'Internal Server Error 500' });
    res.status(200).json(result);
  });
});

// Registration POST request
app.post('/register', (req, res) => {
  const first = req.body.firstName;
  const last = req.body.lastName;
  const { email } = req.body;
  const { password } = req.body;
  database.query('SELECT * FROM `logins` WHERE `email`=?', [email], (err1, result) => {
    if (err1) res.status(500).json({ Error: 'Internal Server Error 500' });

    if (result.length === 0) {
      if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
        bcrypt.hash(password, saltRounds, (err2, hash) => {
          if (err2) res.status(500).json({ Error: 'Internal Server Error 500' });

          database.query('INSERT INTO `logins`(`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)', [first, last, email, hash], (err3) => {
            if (err3) res.status(500).json({ Error: 'Internal Server Error 500' });

            res.status(201).json({ Message: 'Successfully registered, you may now login' });
          });
        });
      } else {
        res.status(400).json({ Message: 'Password does not meet the requirements' });
      }
    } else {
      res.status(409).json({ Message: 'User already exists' });
    }
  });
});

// Login POST request
app.post('/login', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  database.query('SELECT * FROM `logins` WHERE `email`= ?', [email], (err1, result1) => {
    if (err1) res.status(401).json({ Message: 'Email not found or password incorrect' });
    if (result1.length === 1) {
      bcrypt.compare(password, result1[0].password, (err2, result2) => {
        if (err2) res.status(500).json({ Error: 'Internal Server Error 500' });

        if (result2) {
          const sesh = req.session;
          sesh.email = email;
          sesh.password = password;
          return res.status(200).json({ Message: 'Login Sucessful' });
        }
        return res.status(401).json({ Message: 'Email not found or password incorrect' });
      });
    }
  });
});

// logout GET request
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).json({ Error: 'Internal Server Error 500' });
  });
  return res.redirect('back');
});

// Example API - For more examples, see this repository: https://github.com/CloudClub-uoft/crud-nodejs-mysql
app.post('/endpoint', (req, res) => {
  // Perform some comparison, operation, etc. on the request body,
  // depending on what functionality you're trying to acheive.

  // Find the Express documentation:
  //      Request object: https://expressjs.com/en/4x/api.html#req
  //      Response object: https://expressjs.com/en/4x/api.html#res

  // Interact with the SQL database using SQL commands via the `database.query()` object.
  // Find SQL commands documentation here: https://www.w3schools.com/sql/sql_intro.asp
  // Find the mysql documentation here: https://www.npmjs.com/package/mysql#introduction

  database.query('SOME COMMAND', ['Some set of values pertaining to the command'], (err, rows) => {
    // Return either an error code+object or a success code+object
    res.status(200).json({
      info: 'Some resource info',
    });
    // OR
    res.status(404).json({
      error: 'Resource not found!',
    });
  });
});

http.listen(port, () => {
  console.log(`Listening on ${port}`);
});
