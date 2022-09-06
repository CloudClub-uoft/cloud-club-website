/**
 * @api {editcomment} /editcomment Edit Comment
 * @apiDescription Edit a comment.
 * @apiName POST-editcomment
 * @apiGroup Forum
 * 
 * @apiParam {String} Comment Content
 *
 */

var Filter = require("bad-words"),
	filter = new Filter();

module.exports = (app, db) => {
	app.post("/editcomment", (req, res) => {
		const sesh = req.session;
		if (!sesh.email) {
			return res.status(401).json({ error: "You are not authorized to perform this action." });
		}

		const { content, post_id, comment_id, camefrom } = req.body;

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

		const query = "UPDATE cloudclub.comments SET content = (?) WHERE comment_id = (?)";
         
		db.query(query, [content, comment_id], (err) => {
			if (err) { console.log(err); return res.status(500).json({ error: "Internal Server Error 500" }); }
			if (camefrom == "webpage") { return res.redirect(`/post?id=${post_id}`) }
			return res.status(201).json({ message: "Comment edited successfully." });
		});
	});
};