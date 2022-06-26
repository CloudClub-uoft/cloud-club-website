module.exports = (app, db) => {
	app.get("/verify", (req, res) => {
		db.query("SELECT * FROM cloudclub.email_verification WHERE uuid = (?)", [req.query.id], (e2, res2) => {
			if (e2) { console.log(e2); return res.status(500).json({ error: "Internal Server Error 500" }); }
            
			if (res2.length == 0) {
				return res.status(404).json({ error: "Invalid verification. Id not found" });
			}
			else if (res2.length == 1) {
				const { uuid, first, last, email } = res2[0];
				db.query("DELETE FROM cloudclub.email_verification WHERE uuid = (?)", [uuid], (e3) => {
					if (e3) { console.log(e3); return res.status(500).json({ error: "Internal Server Error 500" }); }
					db.query("UPDATE cloudclub.logins SET verified=1 WHERE email = (?)", [email], (e4) => {
						if (e4) { console.log(e4); return res.status(500).json({ error: "Internal Server Error 500" }); }
						return res.status(201).json({ message: "Successfully verified! You may now log in" }); // render a button that links it to the login page?
					});
				})
			}
			else {
				return res.status(500).json({ error: "Cannot Verify. More Than 1 Matching uuid Found" } );
			}
		});
	});
};