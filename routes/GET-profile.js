module.exports = (app, db) => {
	app.get("/profile", (req, res) => {
		const sesh = req.session;
		var numPosts;
		var latestPostId = -1;
		var latestPostSubject;
		if (!sesh.email) {
			return res.redirect("/?tm=You Aren't Logged In!&ts=false");
		}
		db.query(`SELECT COUNT(*) FROM cloudclub.forum WHERE userid='${sesh.userid}'`,(err, forumPosts) => {
			if (err) {console.log(err); return res.redirect("/?tm=Internal Server Error 500&ts=false");}
			numPosts = forumPosts[0]["COUNT(*)"];
			db.query(`SELECT * FROM cloudclub.forum WHERE userid='${sesh.userid}' ORDER BY timestamp DESC LIMIT 1`, (err, latestPost) => {
				if (err) {console.log(err); return res.redirect("/?tm=Internal Server Error 500&ts=false");}
				if (numPosts != 0) {
					latestPostId = latestPost[0]["postid"];
					latestPostSubject = latestPost[0]["subject"];
				}
				db.query(`SELECT * FROM cloudclub.profiles WHERE userid='${sesh.userid}'`, (err, result1) => {
					if (err) {
						return res.redirect("/?tm=Internal Server Error 500&ts=false");
					}
					else {
						if (result1.length === 0) {
							db.query("INSERT INTO cloudclub.profiles (`profile_path`, `description`, userid) VALUES (?, ?, ?)", ["", "", sesh.userid], (err2) => {
								if (err2) { console.log(err2); return res.redirect("/?tm=Internal Server Error 500&ts=false"); }
								db.query(`SELECT * FROM cloudclub.profiles WHERE userid='${sesh.userid}'`, (err3, result2) => {
									if (err3) { console.log(err2); return res.redirect("/?tm=Internal Server Error 500&ts=false"); }
									return res.render("profile", { "selected": "profile", "title": "CloudClub | My Profile", "latestPostSubject": latestPostSubject, "latestPostId":latestPostId, "numPosts": numPosts, "date": sesh.date, "email":sesh.email, "verified":sesh.verified,"first":sesh.first, "last":sesh.last, "description": result2[0].description,"profile_path": result2[0].profile_path, "tm" : req.query.tm, "ts" : req.query.ts});
								})
							});
						}
						else return res.render("profile", { "selected": "profile", "title": "CloudClub | My Profile", "latestPostSubject": latestPostSubject, "latestPostId":latestPostId, "numPosts": numPosts, "date": sesh.date, "email":sesh.email, "verified":sesh.verified, "first":sesh.first, "last":sesh.last, "description": result1[0].description,"profile_path": result1[0].profile_path, "tm" : req.query.tm, "ts" : req.query.ts}); 
					}
				});
			});
		});
	});
};
