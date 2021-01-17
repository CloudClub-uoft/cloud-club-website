// Packages
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const PORT = process.env.PORT || 3000;

// Connect to the database
const database = mysql.createConnection({
    host: 'sql2.freemysqlhosting.net',
    user: 'sql2377507',
    password: 'lD1%xR6%',
    port: 3306,
    database: 'sql2377507'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Dynamic Routes
// Register GET request
app.get('/login', (req,res)=> {
    res.render('login')
});

app.get('/register', (req,res)=> {
    res.render('register')
});

// Login POST request
// TO-DO: Session creation
app.post('/login', (req, res)=> {
    var email = req.body.email;
    var password = req.body.password;
    database.query('SELECT * FROM `logins` WHERE `email`= ?', [email], function(err, result, fields) {
        if (err) res.status(500).json({'Error': 'Internal Server Error 500'});
        if (result.length == 1) {
                bcrypt.compare(password, result[0].password, function(err, result) {
                    if (result) {
                        res.status(200).json({'Message': 'Login Sucessful'});
                    } else {
                        res.status(401).json({'Message': 'Email not found or password incorrect'});
                    };
                });
        } else {
            res.status(401).json({'Message': 'Email not found or password incorrect'});
        }
    });
});

// New Post - who? when? what?

app.post('/newpost', (req, res)=> {
    // Making a new post, the request contains all the info we need

    // Check auth token

    // Check data + types

    // SQL CREATE - return upon success or internal server error
});

app.post('/getposts', (req, res)=> {
    // Getting the N lastest posts

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
app.get('/members', (req, res)=> {
    database.query('SELECT * FROM `clubmembers`', function(err, result, fields) {
        if (err) res.status(500).json({'Error': 'Internal Server Error 500'});
        res.status(200).json(result);
    });
});

// Register GET request

app.get('/register', (req,res)=> {
    res.render('register')
});


// Registration POST request
app.post('/register', (req, res)=> {
    var first = req.body.firstName;
    var last = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    // TO-DO: email validation
    database.query('SELECT * FROM `logins` WHERE `email`=?', [email], function(err, result, fields) {
        if (err) res.status(500).json({'Error': 'Internal Server Error 500'});
        if (result.length == 0) {
            if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
                bcrypt.hash(password, saltRounds, (err, hash)=> {
                    if (err) res.status(500).json({'Error': 'Internal Server Error 500'});
                    database.query('INSERT INTO `logins`(`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)', [first, last, email, hash], function(err, result, fields) {
                        if (err) res.status(500).json({'Error': 'Internal Server Error 500'});
                        res.status(201).json({'Message': 'Successfully registered'});
                    });
                });
            } else {
                // TO-DO: specify which requirements are not met
                res.status(400).json({'Message': 'Password does not meet the requirements'});
            };
        } else {
            res.status(409).json({'Message': 'User already exists'});
        }
    });
});

//Example API - For more examples, see this repository: https://github.com/CloudClub-uoft/crud-nodejs-mysql
app.post('/endpoint', (req, res)=> {
    // Perform some comparison, operation, etc. on the request body, 
    // depending on what functionality you're trying to acheive.

    // Find the Express documentation:
    //      Request object: https://expressjs.com/en/4x/api.html#req
    //      Response object: https://expressjs.com/en/4x/api.html#res

    // Interact with the SQL database using SQL commands via the `database.query()` object.
    // Find SQL commands documentation here: https://www.w3schools.com/sql/sql_intro.asp
    // Find the mysql documentation here: https://www.npmjs.com/package/mysql#introduction
    
    database.query("SOME COMMAND", ['Some set of values pertaining to the command'], (err, rows)=>{
        
        // Return either an error code+object or a success code+object
        res.status(200).json({
            'info' : "Some resource info"
        });
        //OR
        res.status(404).json({
            'error' : "Resource not found!"
        });
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
});