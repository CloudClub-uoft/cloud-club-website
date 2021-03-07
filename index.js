// Packages
require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');

// Redis connection
require('./config/redis-connection')(app);

// Configuration
const port = process.env.PORT || 80;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Dynamic routing
require('./routes/routing').boot(app);

http.listen(port, () => {
  console.log(`Web server now listening on port ${port}`);
});
