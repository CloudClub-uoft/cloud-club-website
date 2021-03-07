const db = require('../config/db-connection');

module.exports = (app) => {
  // New forum post POST request
  app.post('/newpost', (req, res) => {
    const sesh = req.session;
    if (!sesh.email) {
      return res.status(401).json({ error: 'You are not authorized to perform this action.' });
    }

    const { subject, body } = req.body;
    if (subject === undefined || body === undefined) {
      return res.status(400).json({ error: 'Missing data, request must include all of: subject, body' });
    }

    db.query(`INSERT INTO cloudclub.forum (userid, subject, body) VALUES (${sesh.userid}, '${subject}', '${body}')`, (err) => {
      if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
      return res.status(201).json({ message: 'Post created successfully.' });
    });
  });
};
