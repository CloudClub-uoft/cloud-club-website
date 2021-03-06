const db = require('../config/db-connection');

// Gets post body from post ID GET request
module.exports = (app) => {
  app.get('/post', (req, res) => {
    const sesh = req.session;
    if (!sesh.email) {
      return res.status(401).json({ error: 'You are not authorized to perform this action.' });
    }

    const { id } = req.query;
    db.query(`SELECT * FROM cloudclub.forum WHERE postid='s${id}'`, (err, result) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
      return res.status(200).json(result[0]);
    });
  });
};
