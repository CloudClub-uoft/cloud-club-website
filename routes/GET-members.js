const db = require('../config/db-connection');

// Member list GET request
module.exports = (app) => {
  app.get('/members', (req, res) => {
    db.query('SELECT * FROM cloudclub.clubmembers', (err, result) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
      return res.status(200).json(result);
    });
  });
};
