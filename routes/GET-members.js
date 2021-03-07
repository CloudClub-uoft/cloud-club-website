const db = require('../config/db-connection');

// Member list GET request
module.exports = (app) => {
  app.get('/members', (req, res) => {
    db.query('SELECT * FROM cloudclub.clubmembers', (err, result) => {
      if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
      return res.status(200).json({ message: 'All members fetched successfully.', data: result });
    });
  });
};
