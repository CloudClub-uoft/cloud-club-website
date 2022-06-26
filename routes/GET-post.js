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
	app.get("/post", (req, res) => {
		if (!req.query.id) {
			return res.redirect("/forum");
		}
		db.query(`SELECT * FROM cloudclub.forum WHERE postid='${req.query.id}'`, (err, result) => {
			if (err) {
				return res.redirect("/forum?tm=Internal Server Error 500&ts=false");
			}

			db.query(`SELECT email FROM cloudclub.logins WHERE id='${result[0].userid}'`, (err2, result2) => {
				if (err2) { console.log(err2); return res.status(500).json({ error: "Internal Server Error 500" }); }
				return res.render("post", { "selected": "forum", "title": "CloudClub | Forum", "post": result[0], "email": result2[0].email, "user_id":req.session.userid, "profile_path": result2[0].profile_path });
			});
		});
	});
};
