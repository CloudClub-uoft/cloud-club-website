// Packages
require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http').createServer(app);

// DB connection
const db = require('./config/db-connection');

// Redis connection
require('./config/redis-connection')(app);

// Configuration
const port = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Dynamic routing
require('./routes/routing').boot(app, db);

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Static Documentation
app.use('/api', express.static('docs'));

http.listen(port, () => {
  console.log(`CloudClub server now listening on port ${port}`)
});
