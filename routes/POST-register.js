/**
 * @api {post} /register Register an account with the CloudClub website.
 * @apiName POST-register
 *
 * @apiParam {String} email : user email [JSON req]
 * @apiParam {String} password: user password [JSON req]
 * @apiParam {String} first: user first name [JSON req]
 * @apiParam {String} last: user last name [JSON req]
 *
 * @apiSuccess [201] message: “Successfully registered, you may now login.”
 *
 * @apiError [400] Missing data, request must include all of: email, password, first, last.
 * @apiError [400] Password too weak! Must be at least 8 characters and have at least one of each: capital letter, lowercase letter, number.
 * @apiError [409] User already exists with that email!
 * @apiError [500] Internal Server Error 500.
 */

const path = require('path');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Registration POST request
module.exports = (app, db) => {
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
