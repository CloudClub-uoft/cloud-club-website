// Packages
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const port = 80;
app.use(bodyParser.json());

// Connect to the database
const database = mysql.createConnection({
    host: 'sql2.freemysqlhosting.net',
    user: 'sql2377507',
    password: 'lD1%xR6%',
    port: 3306,
    database: 'sql2377507'
});

app.use(express.static('public'));

// Login POST request
app.post('/login', (req, res)=> {
    var user = req.body.username;
    var password = req.body.password;
    var sql = 'SELECT * FROM `logins` WHERE `username`=' + database.escape(user) + ' AND `password`=' + database.escape(password);
    database.query(sql, function(error, results, fields) {
        if (error) res.status(500).send('Internal Server Error 500');
        if (results.length > 0) {
            res.status(200).send('Login Successful');
        } else {
            res.status(401).send('Login Unsuccessful');
        }
        res.end();
    });
});

// Member list GET request
app.get('/members', (req, res)=> {
    database.query('SELECT * FROM `clubmembers`', function(error, results, fields) {
        res.status(200).json(results);
    });
});

// Registration POST request
app.post('/register', (req, res)=> {
    var user = req.body.username;
    var password = req.body.password;
    database.query('SELECT * FROM `logins` WHERE `username`= ?', [user], function(error, results, fields) {
        if (results.length == 0) {
            if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
                bcrypt.hash(password, saltRounds, (err, hash)=> {
                    database.query('INSERT INTO `logins`(username, password) VALUES (?, ?)', [user, hash], function(error, results, fields) {
                        if (error) res.send('Internal Server Error 500');
                        res.status(201).send('Successfully registered');
                    });
                });
            } else {
                // TO-DO: specify which requirements are not met
                res.status(400).send('Password does not meet the requirements');
            };
        } else {
            res.status(409).send('User already exists');
        }
        res.end();
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

http.listen(port, () => {
});