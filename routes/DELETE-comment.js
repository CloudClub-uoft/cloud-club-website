/**
 * @api {post} /deletecomment Delete Post
 * @apiParam {comment_id} Comment id
 * 
 * This is not meant to be a publicy accesible API.
 */

module.exports = (app, db) => {
	// New forum post POST request
	app.delete("/deletecomment", (req, res) => {
		
		const sesh = req.session;
		if (!sesh.email) {
			return res.status(401).json({ error: "You are not authorized to perform this action." });
		}

		const { comment_id } = req.body;

		if (comment_id === undefined || comment_id === "") {
			return res.redirect("/forum?tm=An error occured!&ts=false")
		}

		try {

			db.query(`DELETE FROM cloudclub.comments WHERE comment_id=${comment_id}`, (err3) => {

				if (err3) {
					console.log(err3);
					return res.redirect("/forum?tm=An error occured!&ts=false");
				}
				else {				

					return res.redirect("/forum?tm=Post Deleted!&ts=false");

				}

			});

		} catch (e) {
			return res.redirect("/forum?tm=An error occured! Please try again.&ts=false");
		}

	});
};