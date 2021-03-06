const db = require('../config/db-connection');

module.exports = (app) => {
  // Gets N latest posts GET request
  app.get('/latest', (req, res) => {
    const sesh = req.session;
    if (!sesh.email) {
      return res.status(401).json({ error: 'You are not authorized to perform this action.' });
    }

    const number = req.query.num;
    if (number <= 0 && number > 100) {
      return res.status(422).json({ error: 'Request out of range, must be between 0 and 100.' });
    }

    db.query(`SELECT * FROM cloudclub.forum ORDER BY timestamp DESC LIMIT ${number}`, (err, result) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
      return res.status(200).json(result);
    });
  });
};
