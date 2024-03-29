const uuid = require("uuid");

module.exports = (app, db, _, transporter) => {
	app.post("/sendmail", (req, res) => {
		const email = req.session.email;
		db.query("SELECT * FROM cloudclub.logins WHERE email=(?) AND verified=0", [email], (e1, res1) => {
			if (e1) { console.log(e1); return res.status(500).json({ message: "Internal server error 500" }); }
			if (res1.length == 1) {

				const firstname = res1[0]["first-name"];
				const lastname = res1[0]["last-name"];
				const token = uuid.v4();

				db.query("SELECT * FROM cloudclub.email_verification WHERE email=(?)", [email], (e2, res2) => {
					if (e2) { console.log(e2); return res.status(500).json({ message: "Internal server error 500" }); }
					// Check timestamp difference
					const currentTime = new Date();
					const timeDifference = Math.abs(currentTime - new Date(res2[0]["timestamp"]));
					const minutesDifference = Math.floor((timeDifference/1000)/60);
					if (minutesDifference < 15) {
						return res.status(429).redirect(`/verifypage?status=tooFrequent&wait=${15-minutesDifference}`);
					}
					else {
						db.query("UPDATE cloudclub.email_verification SET uuid=(?), timestamp=(?) WHERE email=(?)", [token, currentTime, email], (e3) => {
							if (e3) { console.log(e3); return res.status(500).json({ message: "Internal server error 500" }); }
						});
						const mailOptions = {
							from: process.env.AUTH_EMAIL,
							to: email,
							subject: "CloudClub Email Confirmation",
							html: `
                                <div>
                                    <div>Dear ${firstname} ${lastname},</div>
                                    <br><br>
                                    <div>Thank you for registering! Please verify your CloudClub account by clicking the link below.</div>
                                    <div>If you didn't register to become a CloudClub member, please ignore this email.</div>
                                    <br>
                                    <a href="http://${req.get("host")}/verify?name=${firstname}-${lastname}&id=${token}">Verify Now</a>
                                    <br><br>
                                    <div>The CloudClub Team</div>
                                </div>
                                `
						};
						transporter.sendMail(mailOptions, (e4, res4) => {
							if (e4) { console.log(e4); return res4.status(500).json({ error: "Internal Server Error 500" }) }
						});
						return res.status(201).redirect("/verifypage?status=success");
					}
				});
			}
		})
	})
}
