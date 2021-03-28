// Packages
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');

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

// Start server
if(process.env.PRODUCTION){
  try{
    // SSL Certificates
    const key = fs.readFileSync('certs/privkey.pem', 'utf8');
    const cert = fs.readFileSync('certs/cert.pem', 'utf8');
    const ca = fs.readFileSync('certs/chain.pem', 'utf8');
    const credentials = {
      key: key,
      cert: cert,
      ca: ca
    };

    const httpsport = process.env.HTTPSPORT || 443;

    // HTTPS main server
    server = require('https').createServer(credentials, app);
    server.listen(process.env.HTTPSPORT, () => {
      console.log(`CloudClub server (secure) now listening on port ${port}->443`)
    });

    //redirect all non-HTTPS incoming traffic to HTTPS on port 443
    require('http').createServer((req, res) => {
      res.writeHead(301, {Location: `https://${req.headers.host}${req.url}`});
      res.end();
    }).listen(port);
  } catch (err) {
    console.log("Could not find certificates!")
    process.exit(1);
  }
}else{
  server = require('http').createServer(app);
  server.listen(port, () => {
    console.log(`CloudClub server (development) now listening on port ${port}`)
  });
}