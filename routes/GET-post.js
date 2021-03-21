/**
 * @api {get} /post?id=:postid Get Single Post
 * @apiDescription Fetch a single post by ID, with content.
 * @apiName GET-post
 * @apiGroup Forum
 *
 * @apiParam {Number{1-100}} id Post ID
 *
 * @apiSuccess {String} message "Post `id` fetched successfully."
 * @apiSuccess {Object} data
 * @apiSuccess {String} data.postid Post ID
 * @apiSuccess {Number} data.userid User ID
 * @apiSuccess {String} data.subject Post Title
 * @apiSuccess {String} data.body Post Content (Markdown)
 * @apiSuccess {Date} data.timestamp Post Timestamp
 *
 * @apiError (401) {String} error "You are not authorized to perform this action."
 * @apiError (500) {String} error "Internal Server Error 500"
 */

module.exports = (app, db) => {
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
