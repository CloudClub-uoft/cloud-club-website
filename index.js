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
const saltRounds = Number.parseInt(process.env.ENC_ROUNDS) || 10;

// Connect to the SQL database
const database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

database.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL database at '${process.env.DB_HOST}:${process.env.DB_PORT}' as user '${process.env.DB_USER}'`);
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
  console.log(`Connected to Redis database at '${process.env.REDIS_HOST}:${process.env.REDIS_PORT}'`);
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
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.status(201).json({ message: 'Post created successfully.' });
  });
});

// Gets N latest posts GET request
app.get('/latest', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
     return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  const number = req.query.num;
  if (!number || number <= 0 || number > 100) {
    return res.status(422).json({ error: 'Request out of range, num must be an integer between 1 and 100.' });
  }

  database.query(`SELECT * FROM cloudclub.forum ORDER BY timestamp DESC LIMIT ${number}`, (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.status(200).json({message: `Latest ${number} posts fetched successfully.`, data: result});
  });
});

// Gets post list GET request
app.get('/posts', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  database.query('SELECT postid, userid, subject, timestamp FROM cloudclub.forum ORDER BY timestamp DESC', (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.status(200).json({message: 'All posts fetched successfully without body.', data: result});
  });
});

// Gets post body from post ID GET request
app.get('/post', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }

  const id = req.query.id;
  database.query(`SELECT * FROM cloudclub.forum WHERE postid='${id}'`, (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.status(200).json({message: `Post ${id} fetched successfully.`, data: result[0]});
  });
});

// Member list GET request
app.get('/members', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }
  database.query('SELECT * FROM cloudclub.clubmembers', (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.status(200).json({message: 'All members fetched successfully.', data: result});
  });
});

// Registration POST request
app.post('/register', (req, res) => {
  const { email, password, first, last } = req.body;
  if(email === undefined || password === undefined || first === undefined || last === undefined){
    return res.status(400).json({ error: 'Missing data, request must include all of: email, password, first, last'})
  }
  database.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result) => {
    if (err1) {console.log(err1);return res.status(500).json({ error: 'Internal Server Error 500' });}

    if (result.length === 0) {
      if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
            bcrypt.hash(password, saltRounds, (err3, hash) => {
            if (err3) {console.log(err2); return res.status(500).json({ error: 'Internal Server Error 500' });}

            database.query('INSERT INTO cloudclub.logins (`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)', [first, last, email, hash], (err3) => {
              if (err3) {console.log(err3);return res.status(500).json({ error: 'Internal Server Error 500' });}

              return res.status(201).json({ message: 'Successfully registered, you may now login.' });
            });
          });
      } else {
        return res.status(400).json({ error: 'Password too weak! Must be at least 8 characters and have at least one of each: capital letter, lowercase letter, number' });
      }
    } else {
      return res.status(409).json({ error: 'User already exists with that email!' });
    }
  });
});

// Login POST request
app.post('/login', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if(email === undefined || password === undefined){
    return res.status(400).json({ error: 'Missing data, request must include all of: email, password'})
  }
  database.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result1) => {
    if (err1) {console.log(err1);return res.status(500).json({ error: 'Internal Server Error 500' });}
    if (result1.length === 1) {
      bcrypt.compare(password, result1[0].password, (err2, result2) => {
        if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });

        if (result2) {
          const sesh = req.session;
          sesh.userid = result1[0].id;
          sesh.email = email;
          sesh.password = password;
          return res.status(200).json({ message: 'Login sucessful!' });
        }
        return res.status(401).json({ error: 'Password incorrect.' });
      });
    } else if (result1.length === 0){
      return res.status(401).json({ error: 'Email not found.' });
    } else {
      console.log(`ERROR: Duplicate login entry under email '${email}'`);
      return res.status(500).json({ error: 'Internal Server Error 500' });
    }
  });
});

// logout GET request
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
  });
  return res.redirect('/');
});

http.listen(port, () => {
  console.log(`Web server now listening on port ${port}`);
});
