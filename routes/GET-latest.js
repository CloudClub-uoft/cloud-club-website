/**
 * @api {get} /latest?num=:num Get Latest Posts
 * @apiDescription Get the latest `num` forum posts, with content, sorted by timestamp (latest first).
 * @apiName GET-latest
 * @apiGroup Forum
 *
 * @apiParam {Number} num The number of posts to return (an integer between 1 and 100).
 *
 * @apiSuccess {String} message "Latest `num` posts fetched successfully without body."
 * @apiSuccess {Object[]} data Latest `num` posts, sorted by timestamp (descending).
 * @apiSuccess {Number} data.postid Post ID
 * @apiSuccess {Number} data.userid ID of user who submitted the post
 * @apiSuccess {String} data.subject Post Title
 * @apiSuccess {String} data.body Post Content (Markdown)
 * @apiSuccess {Number} data.timestamp Post Timestamp
 *
 * @apiError (401) {String} error "You are not authorized to perform this action."
 * @apiError (422) {String} error "Request out of range, check our API docs at cloudclub.ca/api"
 * @apiError (500) {String} error "Internal Server Error 500"
 */

module.exports = (app, db) => {
	// Gets N latest posts GET request
	app.get("/latest", (req, res) => {
		const sesh = req.session;
		if (!sesh.email) {
			return res.status(401).json({ error: "You are not authorized to perform this action." });
		}

		if(!req.query.num) {
			return res.status(400).json({ error: "Missing fields, check our API docs at cloudclub.ca/api"});
		}
		const number = Number.parseInt(req.query.num);
		if (number <= 0 && number > 100) {
			return res.status(422).json({ error: "Request out of range, check our API docs at cloudclub.ca/api" });
		}

		db.query(`SELECT * FROM cloudclub.forum ORDER BY timestamp DESC LIMIT ${number}`, (err, result) => {
			if (err) { console.log(err); return res.status(500).json({ error: "Internal Server Error 500" }); }
			return res.status(200).json({ message: `Latest ${number} posts fetched successfully without body.`, data: result });
		});
	});
};
