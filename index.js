// Packages
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const expressLayouts = require('express-ejs-layouts');

// Config
require('dotenv').config();
const port = process.env.PORT || 80;

// Submodules
require('./config/redis-sessions')(app);
const db = require('./config/sql-db');

// Express setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Dynamic routing
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
require('./routes/routing').boot(app, db);

// Static Documentation
app.use('/api', express.static('docs'));

http.listen(port, () => {
  console.log(`CloudClub server now listening on port ${port}`)
});