// Packages
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
if(require('dotenv').config().error){
  throw new Error("Failed to load .env file");
}

// bcrypt settings
const saltRounds = 10;
const port = process.env.PORT || 80;

// jsonwebtoken settings
const jwtKey = 'qTvwckE3Gs';
const jwtExpiry = 7 * 24 * 60; // 1 week

// Connect to the database
const database = mysql.createConnection({
  host: process.env.SQLHOST,
  user: process.env.SQLUSER,
  password: process.env.SQLPASSWORD,
  port: process.env.SQLPORT
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Dynamic Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// New Post - who? when? what?

app.post('/newpost', (req, res)=> {
    // Making a new post, the request contains all the info we need

    // need to change based on session login

    jwt.verify(token, (err,verifiedJwt) => {
        if(err){
            res.status(404).json({
                'error': "Not Valid"
            });
        }else{
            res.send(verifiedJwt)
        }
    });

    // Check data + types

    // SQL CREATE - return upon success or internal server error

      // see register post method
    database.query(`INSERT INTO forum (postid, userid, subject, body, timestamp) VALUES (${req.body.postid}, ${req.body.userid}, ${req.body.subject}, ${req.body.body}, ${req.body.timestamp})`, function(err, result) {
        if (err) {
            res.status(500).json({
                'Error': "Internal Server Error 500"
            });
        } else{
            res.status(201).json({
                "Message": "Post Created"
            });
        }
    });

});

app.post('/getposts', (req, res)=> {
    // Getting the N lastest posts

    const number = req.body;

    // Check if Positive Number
    if ((0 < number) && (number <= 100)) {
      res.status(201).json({
        Message: 'Post Number Valid'
      });
    } else {
      res.status(401).json({
        Error: "Enter a Valid Integer from 1 to 100"
      });
    }


    // SQL SELECT (select last N in table based on id)

    var response = { 
        message: "Posts fetched successfully.",
        posts: [ 
            {
                "id" : 0, 
                "uid" : "jlefebvre55", 
                "subject" : "Hello World", 
                "body" : "What's up forum. This is the first post ever! - JL",
                "timestamp" : 1234567
            }
        ] 
    }
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

            res.status(201).json({ Message: 'Successfully registered' });
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
          console.log(email);
          console.log(token);

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
  console.log('CloudClub server now listening on port '+port);
});
