/**
 * @api {get} /post?id=:postid Get a single post
 * @apiName GET-post
 * @apiGroup Forum
 *
 * @apiParam {Number} id post ID
 *
 * @apiSuccess {Object} data
 * @apiSuccess {String} data.postid Post ID
 * @apiSuccess {Number} data.userid User ID
 * @apiSuccess {String} data.subject Post Title
 * @apiSuccess {String} data.body Post Body
 * @apiSuccess {Date} data.timestamp Timestamp of post YYYY-MM-DD HH-MM-SS
 *
 * @apiError 401 You are not authorized to perform this action
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
