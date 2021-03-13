/**
 * @api {get} /latest Get the latest num forum posts (sorted by timestamp, descending).
 * @apiName GET-latest
 *
 * @apiParam {Number} num: integer between 1 and 100, determines the number of posts to return
 *
 * @apiSuccess {Object[]} data: array of postid {Number}, userid {Number}, subject {String}, body {String}, timestamp {Number}.
 * @apiSuccess [200] message: “Latest num posts fetched successfully.”
 *
 * @apiError [401] You are not authorized to perform this action.
 * @apiError [422] Request out of range, must be between 0 and 100.
 * @apiError [500] Internal Server Error 500.
 */

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
      if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
      return res.status(200).json({ message: `Latest ${number} posts fetched successfully without body.`, data: result });
    });
  });
};
