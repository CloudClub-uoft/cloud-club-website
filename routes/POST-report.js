/**
 * @api {post} /report Report Post
 * @apiParam {String} body Post Content (Markdown)
 * @apiParam {Integer} Post id 
 * 
 * This is not meant to be a publicy accesible API.
 */

const { IncomingWebhook } = require('@slack/webhook');
// Read a url from the environment variables
const url = process.env.SLACK_WEBHOOK_URL;
// Initialize
const webhook = new IncomingWebhook(url);

module.exports = (app, db, s3Client) => {

	app.post('/report', (req, res) => {

		const sesh = req.session;
		if (!sesh.email) {
			return res.status(401).json({ error: 'You are not authorized to perform this action.' });
		}

		const { post_id, comment } = req.body;

		if (comment === undefined || post_id === undefined || post_id === "" || comment === "") {
			return res.redirect('/forum?tm=An error occured!&ts=false')
		}

		try {

			logged = db.query('INSERT INTO cloudclub.reports (`subject`, `report_verified`, `post_id`) VALUES (?, ?, ?)', [comment, false, post_id], (err3, result) => {

				if (err3) {
					console.log(err3);
					return res.redirect('/forum?tm=An error occured!&ts=false');
				}
				else {

					if (result != null) {

						// Send the notification
						(async () => {
							await webhook.send({
								text: `Report ID: ${result.insertId}. Content: ${comment}. Post ID: ${post_id}`,
							});
						})();

					}

					return res.redirect('/forum?tm=Post Reported!&ts=false');

				}

			});

		} catch (e) {
			return res.redirect('/forum?tm=An error occured! Please try again.&ts=false');
		}

	});

};