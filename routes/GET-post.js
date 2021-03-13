/**
 * @api {get} /post?id=postid Get a single post, indexed by post id.
 * @apiName GET-post
 *
 * @apiParam {Number} id: post ID
 *
 * @apiSuccess {object[]} data
 * @apiSuccess {string} data.postid Post ID
 * @apiSuccess {number} data.userid User ID
 * @apiSuccess {string} data.subject Post Title
 * @apiSuccess {string} data.body Post Body
 * @apiSuccess {number} data.timestamp Timestamp of post YYYY-MM-DD HH-MM-SS
 *
 * @apiError (401) You are not authorized to perform this action.
 * @apiError (500) Internal Server Error 500.
 */

const db = require('../config/db-connection');

module.exports = (app) => {
  app.get('/post', (req, res) => {
    const sesh = req.session;
    if (!sesh.email) {
      return res.status(401).json({ error: 'You are not authorized to perform this action.' });
    }

    const { id } = req.query;
    db.query(`SELECT * FROM cloudclub.forum WHERE postid='s${id}'`, (err, result) => {
      if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
      return res.status(200).json({ message: `Post ${id} fetched successfully.`, data: result[0] });
    });
  });
};
