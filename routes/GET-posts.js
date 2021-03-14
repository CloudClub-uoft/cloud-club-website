/**
 * @api {get} /posts Get all posts without their bodies (sorted by timestamp, descending).
 * @apiName GET-posts
 *
 * @apiSuccess {Object[]} data: array of postid {Number}, userid {Number}, subject {String}, timestamp {Number}.
 * @apiSuccess [200] message: “All posts fetched successfully without body.”
 *
 * @apiError [401] You are not authorized to perform this action.
 * @apiError [500] Internal Server Error 500.
 */

module.exports = (app, db) => {
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
