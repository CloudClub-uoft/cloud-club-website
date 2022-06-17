module.exports = (app, db) => {
	app.get("/verify", (req, res) => {
		db.query(`SELECT * FROM cloudclub.email_verification WHERE uuid=${req.query.id}`, (e2, res2) => {
			if (e2) { console.log(e2); return res.status(500).json({ error: "Internal Server Error 500" }); }
            
			if (res2.length == 0) {
				return res.status(404).json({ error: "Invalid verification. Id not found" });
			}
			else if (res2.length == 1) {
				const { uuid, first, last, email, password } = res2[0];
				db.query(`DELETE FROM cloudclub.email_verification WHERE uuid=${uuid}`, (e2) => {
					if (e2) { console.log(e2); return res.status(500).json({ error: "Internal Server Error 500" }); }
				})

				// add email to logins database
				db.query("INSERT INTO cloudclub.logins (`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)", [first, last, email, password], (err3) => {
					if (err3) { console.log(err3); return res.status(500).json({ error: "Internal Server Error 500" }); }
				});

				// generate login session
				// maybe make a query to get this user immediately to access .id and .date
				const sesh = req.session;
				const options = { year: "numeric", month: "long", day: "numeric" };
				const date = new Date(res2[0].date); // NEED TO ADD DATE TO cloudclub.email_verification
				sesh.date = date.toLocaleDateString("en-US", options);
				sesh.userid = res2[0].id;
				sesh.email = email;
				sesh.password = password;
				sesh.first = res2[0]["first-name"];
				sesh.last = res2[0]["last-name"];
				return res.status(200).json({ message: "Verification Successful!" });
			}
			else {
				return res.status(500).json({ error: "Cannot Verify. More Than 1 Matching uuid Found" } );
			}
		});
	});
};