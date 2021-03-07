const db = require('../config/db-connection');

module.exports = (app) => {
  // Gets post list GET request
  app.get('/posts', (req, res) => {
    const sesh = req.session;
    if (!sesh.email) {
      return res.status(401).json({ error: 'You are not authorized to perform this action.' });
    }

    db.query('SELECT postid, userid, subject, timestamp FROM cloudclub.forum', (err, result) => {
      if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
      return res.status(200).json({ message: 'All posts fetched successfully without body.', data: result });
    });
  });
};
