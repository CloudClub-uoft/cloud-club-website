/**
 * @api {post} /deletepost Delete Post
 * @apiParam {post_id} Post id
 * 
 * This is not meant to be a publicy accesible API.
 */

module.exports = (app, db) => {
	// New forum post POST request
	app.delete('/deletepost', (req, res) => {
		
		const sesh = req.session;
		if (!sesh.email) {
			return res.status(401).json({ error: 'You are not authorized to perform this action.' });
		}

		const { post_id } = req.body;

		if (post_id === undefined || post_id === "") {
			return res.redirect('/forum?tm=An error occured!&ts=false')
		}

		try {

			logged = db.query(`DELETE FROM cloudclub.forum WHERE postid=${post_id}`, (err3, result) => {

				if (err3) {
					console.log(err3);
					return res.redirect('/forum?tm=An error occured!&ts=false');
				}
				else {				

					return res.redirect('/forum?tm=Post Deleted!&ts=false');

				}

			});

		} catch (e) {
			return res.redirect('/forum?tm=An error occured! Please try again.&ts=false');
		}

	});
};