/**
 * @api {post} /newpost Create a new forum post under your user ID (attached to session at login time).
 * @apiName POST-newpost
 *
 * @apiParam {String} subject: title of post [JSON req]
 * @apiParam {String} body: body of post [JSON req]
 *
 * @apiSuccess [200] message: “Post created successfully.”
 *
 * @apiError [400] Missing data, request must include all of: subject, body
 * @apiError [401] You are not authorized to perform this action.
 * @apiError [500] Internal Server Error 500.
 */

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
