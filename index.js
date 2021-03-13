// Packages
require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http').createServer(app);

// Redis connection
require('./config/redis-connection')(app);

// Configuration
const port = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Dynamic routing
require('./routes/routing').boot(app);

// Static Documentation
app.use('/api', express.static('docs'));

http.listen(port, () => {
  console.log(`Web server now listening on port ${port}`);
});
