module.exports = (app, db) => {
	app.get("/resetpassword", (req, res) => {
		var notFound = {
			selected: "notfound",
			title: "CloudClub | Error 409",
			code: "Error 409",
			error: "Token Has Expired or Does Not Exist",
			message: "Please request another password reset."
		}
		var token = req.query.token;
		if (token == null) {
			return res.status(409).render("notfound", notFound);
		}
		else if (token.length == 0) {
			return res.status(409).render("notfound", notFound);
		}
		else {
			db.query(`SELECT * FROM cloudclub.password_reset WHERE token='${token}'`, (err1, result) => {
				if (err1) { console.log(err1); return res.status(500).json({ error: "Internal Server Error 500" }); }
				if (result[0] == null) { return res.status(409).render("notfound", notFound);}
				if (result[0].length == 0) { return res.status(409).render("notfound", notFound);}
	
				// Time between present and most recent request: 
				var diff = Math.abs(new Date() - new Date(result[0].request_timestamp));
				var minutes = Math.floor((diff/1000)/60);
				if (minutes > 15) { return res.status(409).render("notfound", notFound); }
				return res.render("resetpassword", { "selected": "resetpassword", "title": "CloudClub | Reset Password", r: (req.query.token)});
			});
		}
	});
};
