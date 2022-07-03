const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
	service:process.env.AUTH_EMAIL_SERVICE,
	host: process.env.AUTH_EMAIL_HOST,
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_EMAIL_PASSWORD
	},
});

module.exports = transporter;
