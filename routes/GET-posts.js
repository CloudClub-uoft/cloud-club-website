/**
 * @api {get} /posts Get All Posts (Metadata)
 * @apiDescription Fetch **ALL** posts, without content, sorted by timestamp (latest first).
 * @apiName GET-posts
 * @apiGroup Forum
 *
 * @apiSuccess {String} message "All posts fetched successfully without body."
 * @apiSuccess {Object[]} data List of posts
 * @apiSuccess {Number} data.postid Post ID
 * @apiSuccess {Number} data.userid User ID
 * @apiSuccess {String} data.subject Post Title
 * @apiSuccess {Number} data.timestamp Post Timestamp
 *
 * @apiError (401) {String} error You are not authorized to perform this action.
 * @apiError (500) {String} error "Internal Server Error 500"
 */

module.exports = (app, db, s3Client) => {
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
