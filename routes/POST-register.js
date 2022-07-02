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
 * @apiSuccess (201) {String} message "Successfully registered, you may now login. Don't forget to verify your email to access additional features."
 *
 * @apiError (400) {String} error "Missing fields, check our API docs at cloudclub.ca/api"
 * @apiError (400) {String} error "Password too weak! Requirements: >8 characters incl. a capital letter, a lowercase letter, and a number"
 * @apiError (409) {String} error "User already exists with that email!"
 * @apiError (500) {String} error "Internal Server Error 500"
 */

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
 
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
						const token = uuid.v4(); 
						db.query("INSERT INTO cloudclub.email_verification (`first-name`, `last-name`, email, uuid) VALUES (?, ?, ?, ?)", [first, last, email, token], (err3) => {
							if (err3) { console.log(err3); return res.status(500).json({ error: "Internal Server Error 500" }); }
							
							// insert into cloudclub.logins, set verified to 0
							db.query("INSERT INTO cloudclub.logins (`first-name`, `last-name`, email, password, verified) VALUES (?, ?, ?, ?, 0)", [first, last, email, hash], (err3) => {
								if (err3) { console.log(err3); return res.status(500).json({ error: "Internal Server Error 500" }); }
							});
                       
							var Transport = nodemailer.createTransport({
								service:"Yandex",
								host: "smtp.yandex.ru",
								auth: {
									user: process.env.AUTH_EMAIL,
									pass: process.env.AUTH_EMAIL_PASSWORD
								},
							});
        
							var mailOptions = {
								from: process.env.AUTH_EMAIL,
								to: email,
								subject: "CloudClub Email Confirmation",
								html: `
									<div>
										<div>Dear ${first} ${last},</div>
										<br><br>
										<div>Thank you for registering! Please verify your CloudClub account by clicking the link below.</div>
										<div>If you didn't register to become a CloudClub member, please ignore this email.</div>
										<br>
										<a href="http://${req.get("host")}/verify?name=${first}-${last}&id=${token}">Verify Now</a>
										<br><br>
										<div>The CloudClub Team</div>
									</div>
									`
							};
							Transport.sendMail(mailOptions, (err4, res) => {
								if (err4) { console.log(err4); return res.status(500).json({ error: "Internal Server Error 500" }) }
							});
 
							return res.status(201).json({ message: "Successfully registered, you may now login. Don't forget to verify your email to access additional features." });
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