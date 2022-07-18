require("path");
const fs = require("fs");
const { promisify } = require("util");
const handlebars = require("handlebars");
const readFile = promisify(fs.readFile);
const crypto = require("crypto")

// Reset Password Request
module.exports = (app, db, _, transporter) => {
	app.post("/reset", (req, res) => {
		const email = req.body.email;
		if(email === undefined) {
			return res.status(400).json({ error: "Missing fields, check our API docs at cloudclub.ca/api"})
		}
		db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result) => {
			if (err1) { console.log(err1); return res.status(500).json({ error: "Internal Server Error 500" }); }
			if (result.length != 0) {
				// Get password reset requests from user
				db.query(`SELECT * FROM cloudclub.password_reset WHERE user_id='${result[0].id}' ORDER BY request_timestamp DESC`, (err2, result2) => {
					if (err2) { console.log(err2); return res.status(500).json({ error: "Internal Server Error 500" }); }

					if (result2.length != 0) {
						// Time between present and most recent request: 
						var diff = Math.abs(new Date() - new Date(result2[0].request_timestamp));
						var minutes = Math.floor((diff/1000)/60);
						if (minutes < 15) { return res.status(201).json({ success: "An email has been sent if the email address is associated with an account." }); }
					}
					// Create a new reset request
					var token;
					var tokenLink;
					crypto.randomBytes(64, function(ex, buf) {
						token = buf.toString("hex");
						if(process.env.PRODUCTION) {
							tokenLink = "https://cloudclub.ca/resetpassword?token=" + token;
						}
						else {
							tokenLink = `http://localhost:${process.env.PORT}/resetpassword?token=` + token;
						}
						db.query("INSERT INTO cloudclub.password_reset (user_id, token) VALUES (?,?)", [result[0].id, token], async (err3) => {
							if (err3) { console.log(err3); return res.status(500).json({ error: "Internal Server Error 500" }); }
							// Send an Email
							let html = await readFile("views/email/passwordreset.html", "utf8");
							let template = handlebars.compile(html);
							let data = {
								name: result[0]["first-name"],
								token: tokenLink
							};
							let htmlToSend = template(data);
							transporter.sendMail({
								from: `"CloudClub" <${process.env.EMAIL_USER}>`,
								to: email,
								subject: "Requested Password Reset",
								html: htmlToSend
							},(err4) => {
								if (err4) { console.log(err4); return res.status(500).json({ error: "Internal Server Error 500" }); }
								return res.status(201).json({ success: "An email has been sent if the email address is associated with an account." });
							});
						});
					});
				});
			}
			else {return res.status(201).json({ success: "An email has been sent if the email address is associated with an account." })}
			
		});
	});
};