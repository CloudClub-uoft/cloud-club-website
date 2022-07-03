const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
	service:"Yandex",
	host: "smtp.yandex.ru",
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_EMAIL_PASSWORD
	},
});

module.exports = transporter;
