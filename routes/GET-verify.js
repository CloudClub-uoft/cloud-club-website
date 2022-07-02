module.exports = (app, db) => {
	app.get("/verify", (req, res) => {
		const email = req.session.email;
		if (!email) {
			return res.redirect("/?tm=Cannot verify. Please log in first&ts=false");
		}

		db.query("SELECT * FROM cloudclub.email_verification WHERE uuid = (?)", [req.query.id], (e2, res2) => {
			if (e2) { console.log(e2); return res.status(500).json({ error: "Internal Server Error 500" }); }
            
			if (res2.length !== 0 || email != res2[0].email) {
				return res.redirect("/?tm=Invalid verification.&ts=false");
			}

			const uuid = res2[0].uuid;
			db.query("DELETE FROM cloudclub.email_verification WHERE uuid = (?)", [uuid], (e3) => {
				if (e3) { console.log(e3); return res.status(500).json({ error: "Internal Server Error 500" }); }
			});
			db.query("UPDATE cloudclub.logins SET verified=1 WHERE email = (?)", [email], (e4) => {
				if (e4) { console.log(e4); return res.status(500).json({ error: "Internal Server Error 500" }); }
				return res.redirect("/login?tm=Successfully Verified! You may now log in&ts=false");
			});
		});
	});
};
