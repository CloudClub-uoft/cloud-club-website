/**
 * @api {comment} /comment New Comment
 * @apiDescription Create a new comment.
 * @apiName POST-comment
 * @apiGroup Forum
 * 
 * @apiParam {String} Comment Content
 *
 * @apiSuccess (201) {String} message "Comment created successfully."
 *
 * @apiError (400) {String} error "Comment cannot be empty!"
 * @apiError (401) {String} error "You are not authorized to perform this action."
 * @apiError (500) {String} error "Internal Server Error 500"
 */

var Filter = require("bad-words"),
	filter = new Filter();

module.exports = (app, db) => {
	app.post("/comment", (req, res) => {
		const sesh = req.session;
		if (!sesh.email) {
			return res.status(401).json({ error: "You are not authorized to perform this action." });
		}

		const { content, post_id, camefrom } = req.body;

		if (filter.isProfane(content)) {
			if (camefrom == "webpage") {
				return res.redirect(`/post?id=${post_id}`);
			}
			else {
				return res.status(201).json({ message: "Comment ratified. Please keep the content appropriate and courteous." });
			}
		}

		if (content === undefined || content === "") {
			if (camefrom == "webpage") { return res.redirect("/post?tm=Please fill in all the required details&ts=false") } else
				return res.status(400).json({ error: "Comment cannot be empty!" });
		}

		const query = "INSERT INTO cloudclub.comments (user_id, post_id, content) VALUES (?,?,?)";
            
		db.query(query, [sesh.userid, post_id, content], (err) => {
			if (err) { console.log(err); return res.status(500).json({ error: "Internal Server Error 500" }); }
			if (camefrom == "webpage") { return res.redirect(`/post?id=${post_id}`) }
			return res.status(201).json({ message: "Comment created successfully." });
		});
	});
};