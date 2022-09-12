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
			return res.redirect("/forum")
		}

		db.query(
			`SELECT * FROM cloudclub.forum WHERE postid='${req.query.id}'`,
			(err1, res1) => {
				if (err1) {
					return res.redirect(
						"/forum?tm=Internal Server Error 500&ts=false"
					)
				}

				db.query(
					`SELECT * FROM cloudclub.comments WHERE post_id='${req.query.id}'`,
					(err2, res2) => {
						if (err2) {
							return res.redirect(
								"/forum?tm=Internal Server Error 500&ts=false"
							)
						}

						let query = `SELECT email, \`first-name\`, \`last-name\`, profile_path, user_id FROM cloudclub.comments JOIN cloudclub.profiles JOIN cloudclub.logins ON comments.user_id=profiles.userid AND comments.user_id=logins.id AND comments.post_id='${req.query.id}'`

						db.query(query, (err3, res3) => {
							if (err3) {
								console.log(err3)
								return res.status(500).json({
									error: "Internal Server Error 500",
								})
							}

							db.query(
								`SELECT email FROM cloudclub.logins WHERE id='${res1[0].userid}'`,
								(err4, emailResult) => {
									if (err4) {
										return res.status(500).json({
											error: "Internal Server Error 500",
										})
									}

									db.query(
										`SELECT * FROM cloudclub.profiles WHERE userid='${res1[0].userid}'`,
										(err5, profilePathResult) => {
											if (err5) {
												return res.status(500).json({
													error: "Internal Server Error 500",
												})
											}

											if (
												profilePathResult[0] ===
												undefined
											) {
												return res.render("post", {
													selected: "forum",
													title: "CloudClub | Forum",
													post: res1[0],
													email: emailResult[0].email,
													user_id: req.session.userid,
													profile_path: "",
													comments: res2,
													userInfo: res3,
												})
											}

											return res.render("post", {
												selected: "forum",
												title: "CloudClub | Forum",
												post: res1[0],
												comments: res2,
												userInfo: res3,
												email: emailResult[0].email,
												user_id: req.session.userid,
												profile_path:
													profilePathResult[0]
														.profile_path,
											})
										}
									)
								}
							)
						})
					}
				)
			}
		)
	})
}
