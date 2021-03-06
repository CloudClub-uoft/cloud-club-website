const bcrypt = require('bcrypt');
const db = require('../config/db-connection');

// Login POST request
module.exports = (app) => {
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result1) => {
      if (err1) return res.status(401).json({ message: 'Email not found OR password incorrect.' });
      if (result1.length === 1) {
        bcrypt.compare(password, result1[0].password, (err2, result2) => {
          if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });

          if (result2) {
            const sesh = req.session;
            sesh.userid = result1[0].id;
            sesh.email = email;
            sesh.password = password;
            return res.status(200).json({ message: 'Login Sucessful!' });
          }
          return res.status(401).json({ message: 'Email not found OR password incorrect.' });
        });
      }
    });
  });
};
