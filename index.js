// Packages
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// bcrypt settings
const saltRounds = 10;
const port = process.env.PORT || 5000;

// jsonwebtoken settings
const jwtKey = 'qTvwckE3Gs';
const jwtExpiry = 7 * 24 * 60; // 1 week

// Connect to the database
const database = mysql.createConnection({
  host: 'sql2.freemysqlhosting.net',
  user: 'sql2377507',
  password: 'lD1%xR6%',
  port: 3306,
  database: 'sql2377507',
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

app.set('layout', 'layouts/layout')

// Dynamic Routes
app.get('/', (req, res) => {
  res.render('index', {'selected': 'homepage', 'title': 'CloudClub | Home'});
});

app.get('/login', (req, res) => {
  res.render('login', {'selected': 'login', 'title': 'CloudClub | Login'});
});

app.get('/register', (req, res) => {
  res.render('register', {'selected': 'register', 'title': 'CloudClub | Register'});
});

app.get('/teampage', (req, res) => {
  res.render('teampage', {'selected': 'teampage', 'title': 'CloudClub | The Team'});
});

app.get('/projects', (req, res) => {
  res.render('projects', {'selected': 'projects', 'title': 'CloudClub | Projects'});
});

app.get('/forum', (req, res) => {
  res.render('forum', {'selected': 'forumpage', 'title': 'CloudClub | Forum'});
});

// Member list GET request // cloudclub.ca/members
app.get('/members', (req, res) => {
  database.query('SELECT * FROM `clubmembers`', (err, result) => {
    if (err) res.status(500).json({ Error: 'Internal Server Error 500' });
    //res.status(200).json(result);
    res.render('members', {selected: 'teampage', res: result})
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
    if (err1) res.status(500).json({ Error: 'Internal Server Error 500' });

    if (result1.length === 1) {
      bcrypt.compare(password, result1[0].password, (err2, result2) => {
        if (err2) res.status(500).json({ Error: 'Internal Server Error 500' });

        if (result2) {
          const token = jwt.sign({ email }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpiry,
          });

          res.cookie('token', token, { maxAge: jwtExpiry * 1000 });
          res.status(200).json({ Message: 'Login Sucessful' });
        } else {
          res.status(401).json({ Message: 'Email not found or password incorrect' });
        }
      });
    } else {
      res.status(401).json({ Message: 'Email not found or password incorrect' });
    }
  });
});

app.get('/logout', (req, res) => {
  const { token } = req.cookies;
  res.cookie('token', token, { maxAge: 0 });
  return res.redirect('back');
});

// JWT token authentication GET request
app.get('/auth', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).end();
  }
  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ Error: 'Unauthorized 401' });
    }
    return res.status(400).json({ Error: 'Bad Request 400' });
  }
  return res.status(200).json({ Message: 'Logged in', Email: `${payload.email}` });
});

// Refresh token POST request
app.post('/refresh', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ Error: 'Unauthorized 401' });
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ Error: 'Unauthorized 401' });
    }
    return res.status(400).json({ Error: 'Bad Request 400' });
  }
  const { email } = payload;
  const newToken = jwt.sign({ email }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry,
  });
  res.cookie('token', newToken, { maxAge: jwtExpiry * 1000 });
  return res.end();
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
  console.log(`Server started on port ${port}`)
});
