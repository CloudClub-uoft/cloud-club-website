/**
 * @api {post} /login Log In
 * @apiDescription Log in to the website. Destroys any existing session.
 * @apiName POST-login
 * @apiGroup Authentication
 * 
 * @apiParam {String} email User's Email
 * @apiParam {String} passwordœ User's Password
 *
 * @apiSuccess {String} message "Login Successful!"
 *
 * @apiError (400) {String} error "Missing fields, check our API docs at cloudclub.ca/api"
 * @apiError (401) {String} error "Password incorrect."
 * @apiError (401) {String} error "Email not found."
 * @apiError (500) {String} error "Internal Server Error 500."
 */

const bcrypt = require("bcrypt");

// Login POST request
module.exports = (app, db) => {
	app.post("/login", (req, res) => {
		const { email, password } = req.body;
		if(email === undefined || password === undefined) {
			return res.status(400).json({ error: "Missing fields, check our API docs at cloudclub.ca/api"})
		}
		db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result1) => {
			if (err1) {console.log(err1);return res.status(500).json({ error: "Internal Server Error 500" });}
			if (result1.length === 1) {
				bcrypt.compare(password, result1[0].password, (err2, result2) => {
					if (err2) return res.status(500).json({ error: "Internal Server Error 500" });

					if (result2) {
						const sesh = req.session;
						const options = {year: "numeric", month: "long", day: "numeric" };
						const date = new Date(result1[0].date);
						sesh.date = date.toLocaleDateString("en-US", options);
						sesh.userid = result1[0].id;
						sesh.email = email;
						sesh.password = password;
						sesh.first = result1[0]["first-name"];
						sesh.last = result1[0]["last-name"];
						return res.status(200).json({ message: "Login Successful!" });
					}
					return res.status(401).json({ error: "Password incorrect." });
				});
			} else if (result1.length === 0) {
				return res.status(401).json({ error: "Email not found." });
			} else {
				console.log(`ERROR: Duplicate login entry under email '${email}'`);
				return res.status(500).json({ error: "Internal Server Error 500" });
			}
		});
	});
};


