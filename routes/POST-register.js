const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../config/db-connection');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Registration POST request
module.exports = (app) => {
  app.post('/register', (req, res) => {
    const { email, password, first, last } = req.body;
    db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result) => {
      if (err1) { console.log(err1); return res.status(500).json({ error: 'Internal Server Error 500' }); }

      if (result.length === 0) {
        if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
          bcrypt.hash(password, process.env.ENC_ROUNDS, (err2, hash) => {
            if (err2) { console.log(err2); return res.status(500).json({ error: 'Internal Server Error 500' }); }

            db.query('INSERT INTO cloudclub.logins (`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)', [first, last, email, hash], (err3) => {
              if (err3) { console.log(err3); return res.status(500).json({ error: 'Internal Server Error 500' }); }

              return res.status(201).json({ message: 'Successfully registered, you may now login.' });
            });
          });
        } else {
          return res.status(400).json({ error: 'Password too weak! Must be at least 8 characters and have at least one of each: capital letter, lowercase letter, number' });
        }
      } else {
        return res.status(409).json({ error: 'User already exists!' });
      }
    });
  });
};
