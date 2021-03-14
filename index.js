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
app.set('view engine', 'ejs');
app.use(express.static('public'));

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Dynamic Routes
app.get('/', (req, res) => {
  res.render('index', { 'selected': 'homepage', 'title': 'CloudClub | Home' });
});

app.get('/login', (req, res) => {
  res.render('login', { 'selected': 'login', 'title': 'CloudClub | Login'});
});

app.get('/register', (req, res) => {
  res.render('register', { 'selected': 'register', 'title': 'CloudClub | Register'});
});

app.get('/teampage', (req, res) => {
  res.render('teampage', { 'selected': 'teampage', 'title': 'CloudClub | The Team'});
});

app.get('/projects', (req, res) => {
  res.render('projects', { 'selected': 'projects', 'title': 'CloudClub | Projects'});
});

app.get('/forum', (req, res) => {
  database.query('SELECT postid, userid, subject, timestamp FROM cloudclub.forum', (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.render('forum', { 'selected': 'forumpage', 'title': 'CloudClub | Forum', 'data': result});
  });
});

app.get('/post', (req, res) => {
  const sesh = req.session;
  if (!sesh.email) {
    return res.status(401).json({ error: 'You are not authorized to perform this action.' });
  }
  const id = req.query.id;
  database.query(`SELECT * FROM cloudclub.forum WHERE postid='${id}'`, (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.render('post', { 'selected': 'forumpage', 'title': 'CloudClub | Post Detail', 'post': result[0]});
  });
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
  try{
    const number = Number.parseInt(req.query.num);
    assert(number > 0 && number <= 100);
  } catch {
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

  database.query('SELECT postid, userid, subject, timestamp FROM cloudclub.forum', (err, result) => {
    if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
    return res.status(200).json({message: 'All posts fetched successfully without body.', data: result});
  });
});

// Member list GET request // cloudclub.ca/members
// app.get('/members', (req, res) => {
//   database.query('SELECT * FROM `cloudclub.clubmembers`', (err, result) => {
//     if (err) res.status(500).json({ error: 'Internal Server Error 500' });
//     //res.status(200).json(result);
//     res.render('members', {selected: 'teampage', res: result})
//   });
// });

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

// Simple get auth state endpoint - is this a security risk?
app.get('/auth', (req, res) => {
  try{
    if(req.session.email){
      return res.status(200).json({ email: req.session.email});
    } else {
      return res.status(401).json();
    }
  } catch {
    return res.status(500).json({error: 'Internal Server Error 500'});
  }
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
