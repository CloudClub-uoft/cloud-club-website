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

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

app.set('layout', 'layouts/layout')

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

// New forum post POST request
app.post('/newpost', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  // Fetch ID key from login table on login, use it here on post creation (make sure to check that it isn't undefined)

  const { subject, body } = req.body;
  if(subject === undefined || body === undefined) {
    return res.status(400).json({ error: 'Missing data, request must include all of: subject, body'})
  }
  database.query(`INSERT INTO cloudclub.forum (userid, subject, body) VALUES (${sesh.userid}, '${subject}', '${body}')`, (err) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    return res.status(201).json({ message: 'Post Created Successfully!' });
  });
});

// Gets N latest posts GET request
app.get('/latest', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
     return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  const number = req.query.num;
  if (number <= 0 && number > 100) {
    return res.status(422).json({ error: 'Request out of range, must be between 0 and 100.' });
  }

  database.query(`SELECT * FROM cloudclub.forum ORDER BY timestamp DESC LIMIT ${number}`, (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    return res.status(200).json(result);
  });
});

// Gets post list GET request
app.get('/posts', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  database.query('SELECT postid, userid, subject, timestamp FROM cloudclub.forum', (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    return res.status(200).json(result);
  });
});

// Gets post body from post ID GET request
app.get('/post', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  const id = req.query.id;
  database.query(`SELECT * FROM cloudclub.forum WHERE postid='s${id}'`, (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    return res.status(200).json(result[0]);
  });
});

// Member list GET request
app.get('/members', (req, res) => {
  database.query('SELECT * FROM cloudclub.clubmembers', (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    return res.status(200).json(result);
  });
});

// Registration POST request
app.post('/register', (req, res) => {
  const first = req.body.firstName;
  const last = req.body.lastName;
  const { email, password } = req.body;
  database.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result) => {
    if (err1) return res.status(500).json({ error: 'Internal Server Error 500' });

    if (result.length === 0) {
      if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
        bcrypt.hash(password, saltRounds, (err2, hash) => {
          if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });

          database.query('INSERT INTO `logins`(`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)', [first, last, email, hash], (err3) => {
            if (err3) return res.status(500).json({ error: 'Internal Server Error 500' });

            return res.status(201).json({ message: 'Successfully registered, you may now login.' });
          });
        });
      } else {
        return res.status(400).json({ message: 'Password does not meet the requirements!' });
      }
    } else {
      return res.status(409).json({ message: 'User already exists!' });
    }
  });
});

// Login POST request
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  database.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result1) => {
    if (err1) return res.status(401).json({ message: 'Email not found OR password incorrect.' });
    if (result1.length === 1) {
      bcrypt.compare(password, result1[0].password, (err2, result2) => {
        if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });

        if (result2) {
          const sesh = req.session;
          sesh.userid = result1[0].id;
          sesh.email = email;
          sesh.password = password;
          return res.status(200).json({ message: 'Login Sucessful!' });
        }
        return res.status(401).json({ message: 'Email not found OR password incorrect.' });
      });
    }
  });
});

// logout GET request
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
  });
  return res.redirect('back');
});

http.listen(port, () => {
  console.log(`CloudClub server now listening on port ${port}`);
});
