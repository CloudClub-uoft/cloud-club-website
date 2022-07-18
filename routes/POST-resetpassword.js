require("path");
const bcrypt = require("bcrypt");
 
// Registration POST request
module.exports = (app, db) => {
	app.post("/resetpassword", (req, res) => {
		const {password, token } = req.body;
		if(password === undefined || token === undefined) {
			return res.status(400).json({ error: "Missing fields, check our API docs at cloudclub.ca/api"})
		}
 
		db.query(`SELECT * FROM cloudclub.password_reset WHERE token='${token}'`, (err1, result) => {
			if (err1) { console.log(err1); return res.status(500).json({ error: "Internal Server Error 500" }); }
			if (result[0].length == 0) { return res.status(400).json({ error: "Token Does Not Exist" });}

			// Time between present and most recent request: 
			var diff = Math.abs(new Date() - new Date(result[0].request_timestamp));
			var minutes = Math.floor((diff/1000)/60);
			if (minutes > 15) { return res.status(409).json({ error: "Token Expired" }); }

			// Update the password if valid token
			if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
				bcrypt.hash(password, Number.parseInt(process.env.ENC_ROUNDS), (err2, hash) => {
					if (err2) { console.log(err2); return res.status(500).json({ error: "Internal Server Error 500" }); }

					db.query(`UPDATE cloudclub.logins SET password = '${hash}' WHERE id='${result[0].user_id}'`, (err3) => {
						if (err3) { console.log(err3); return res.status(500).json({ error: "Internal Server Error 500" }); }

						// Delete all password reset requests
						db.query(`DELETE FROM cloudclub.password_reset WHERE token='${token}'`, (err4) => {
							if (err4) { console.log(err4); return res.status(500).json({ error: "Internal Server Error 500" }); }
							return res.status(201).json({ message: "Successful, you may now login." });
						});
					});
				});
			} else {
				return res.status(400).json({ error: "Password too weak! Requirements: >8 characters incl. a capital letter, a lowercase letter, and a number" });
			}
		});
	});
};
 