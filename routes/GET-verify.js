module.exports = (app, db) => {
	app.get("/verify", (req, res) => {

		db.query("SELECT * FROM cloudclub.email_verification WHERE uuid = (?)", [req.query.id], (e2, res2) => {
			if (e2) { console.log(e2); return res.status(500).json({ error: "Internal Server Error 500" }); }
            
			if (res2.length === 0) {
				return res.status(400).redirect("/?tm=Invalid verification.&ts=false");
			}

			const uuid = res2[0].uuid;
			const email = res2[0].email;

			db.query("DELETE FROM cloudclub.email_verification WHERE uuid = (?)", [uuid], (e3) => {
				if (e3) { console.log(e3); return res.status(500).json({ error: "Internal Server Error 500" }); }
				db.query("UPDATE cloudclub.logins SET verified=1 WHERE email = (?)", [email], (e4) => {
					if (e4) { console.log(e4); return res.status(500).json({ error: "Internal Server Error 500" }); }
					
					db.query("SELECT * FROM cloudclub.logins WHERE email = (?)", [email], (e5, res5) => {

						if (e5) { console.log(e5); return res.status(500).json({ error: "Internal Server Error 5001" }); }
						if (res5.length === 1) {
							const sesh = req.session;
							const options = { year: "numeric", month: "long", day: "numeric" };
							const date = new Date(res5[0].date);
							sesh.date = date.toLocaleDateString("en-US", options);
							sesh.userid = res5[0].id;
							sesh.email = email;
							sesh.password = res5[0].password;
							sesh.first = res5[0]["first-name"];
							sesh.last = res5[0]["last-name"];
							sesh.verified = 1;
							
							return res.render("verifysuccess", { "selected": "verifysuccess", "title": "CloudClub | Successfully Verified" });
						}
						else {
							return res.status(401).json({ error: "Login Failed." });
						}
					});
				});
			});
		});
	});
};
