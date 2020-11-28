// Packages
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const mysql = require('mysql')
const bodyParser = require('body-parser')

const port = 80 
app.use(bodyParser.json());

// Connect to the database
const database = mysql.createConnection({
    host: 'sql2.freemysqlhosting.net',
    user: 'sql2377507',
    password: 'lD1%xR6%',
    port: 3306,
    database: 'sql2377507'
});

app.use(express.static('public'))

// Login POST request
app.post('/login', (req, res)=> {
    var user = req.body.username;
    var password = req.body.password;
    var sql = 'SELECT * FROM `logins` WHERE `username`=' + database.escape(user) + ' AND `password`=' + database.escape(password);
    database.query(sql, function(error, results, fields) {
        if (results.length > 0) {
            res.send('Login Successful');
        } else {
            res.send('Login Unsuccessful');
        }
        res.end();
    });
})

// Member list GET request
app.get('/members', (req, res)=> {
    database.query('SELECT * FROM `clubmembers`', function(error, results, fields) {
        res.json(results);
    })
})

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
        })
    });
})

http.listen(port, () => {
});