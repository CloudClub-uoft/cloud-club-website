/**
 * @api {post} /register Register
 * @apiDescription Register an account.
 * @apiName POST-register
 * @apiGroup Authentication
 * 
 * @apiParam {String} email User's Email
 * @apiParam {String} password User's Password
 * @apiParam {String} first User's First Name
 * @apiParam {String} last User's Last Name
 *
 * @apiSuccess (201) {String} message "Successfully registered, you may now login."
 *
 * @apiError (400) {String} error "Missing fields, check our API docs at cloudclub.ca/api"
 * @apiError (400) {String} error "Password too weak! Requirements: >8 characters incl. a capital letter, a lowercase letter, and a number"
 * @apiError (409) {String} error "User already exists with that email!"
 * @apiError (500) {String} error "Internal Server Error 500"
 */

require("path");
const bcrypt = require("bcrypt");

// Registration POST request
module.exports = (app, db) => {
	app.post("/register", (req, res) => {
		const { email, password, first, last } = req.body;
		if(email === undefined || password === undefined || first === undefined || last === undefined) {
			return res.status(400).json({ error: "Missing fields, check our API docs at cloudclub.ca/api"})
		}

		db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result) => {
			if (err1) { console.log(err1); return res.status(500).json({ error: "Internal Server Error 500" }); }

			if (result.length === 0) {
				if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8) {
					bcrypt.hash(password, Number.parseInt(process.env.ENC_ROUNDS), (err2, hash) => {
						if (err2) { console.log(err2); return res.status(500).json({ error: "Internal Server Error 500" }); }

						db.query("INSERT INTO cloudclub.logins (`first-name`, `last-name`, email, password) VALUES (?, ?, ?, ?)", [first, last, email, hash], (err3) => {
							if (err3) { console.log(err3); return res.status(500).json({ error: "Internal Server Error 500" }); }

							return res.status(201).json({ message: "Successfully registered, you may now login." });
						});
					});
				} else {
					return res.status(400).json({ error: "Password too weak! Requirements: >8 characters incl. a capital letter, a lowercase letter, and a number" });
				}
			} else {
				return res.status(409).json({ error: "User already exists!" });
			}
		});
	});
};
