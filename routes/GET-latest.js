/**
 * @api {get} /latest?num=:num Get the latest forum posts
 * @apiName GET-latest
 * @apiGroup Forum
 *
 * @apiParam {Number} num The number of posts to return (an integer between 1 and 100).
 *
 * @apiSuccess {String} message "Latest `num` posts fetched successfully without body."
 * @apiSuccess {Object[]} data Latest posts, sorted by timestamp (descending).
 * @apiSuccess {Number} data.postid Post ID
 * @apiSuccess {Number} data.userid ID of user who submitted the post
 * @apiSuccess {String} data.subject Post Title
 * @apiSuccess {String} data.body Post Body (Markdown)
 * @apiSuccess {Number} data.timestamp Timestamp of post (YYYY-MM-DD HH-MM-SS)
 *
 * @apiError (401) {String} error "You are not authorized to perform this action."
 * @apiError (422) {String} error "Request out of range, must be between 0 and 100."
 * @apiError (500) {String} error "Internal Server Error 500"
 */

module.exports = (app, db) => {
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
