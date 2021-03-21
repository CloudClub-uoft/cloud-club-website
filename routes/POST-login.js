/**
 * @api {post} /login Log In
 * @apiDescription Log in to the website.
 * @apiName POST-login
 * @apiGroup Authentication
 * 
 * @apiParam {String} email User's Email
 * @apiParam {String} password User's Password
 *
 * @apiSuccess {String} message "Login Successful!"
 *
 * @apiError (400) {String} error "Missing data, request must include all of: email, password."
 * @apiError (401) {String} error "Password incorrect."
 * @apiError (401) {String} error "Email not found."
 * @apiError (500) {String} error "Internal Server Error 500."
 */

const bcrypt = require('bcrypt');

// Login POST request
module.exports = (app, db) => {
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result1) => {
      if (err1) return res.status(401).json({ error: 'Email not found OR password incorrect.' });
      if (result1.length === 1) {
        bcrypt.compare(password, result1[0].password, (err2, result2) => {
          if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });

          if (result2) {
            const sesh = req.session;
            sesh.userid = result1[0].id;
            sesh.email = email;
            sesh.password = password;
            return res.status(200).json({ message: 'Login Successful!' });
          }
          return res.status(401).json({ error: 'Password incorrect.' });
        });
      } else {
        return res.status(401).json({ error: 'Email not found.' });
      }
    });
  });
};
