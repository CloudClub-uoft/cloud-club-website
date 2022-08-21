module.exports = (app) => {
	app.get("/verifypage", (req, res) => {
		if (!req.session.email) {
			return res.redirect("/?tm=Cannot verify. Please log in first&ts=false");
		}
		if (req.session.verified) {
			return res.redirect("/?tm=You've Already Verified!&ts=false");
		}
		let success;
		let message = "";
		if (req.query.status === "success") {
			message = "An email has been sent if credentials are valid";
			success = true;
		}
		if (req.query.status === "tooFrequent") {
			message = `Are you sure you didn't get an email? Check your inbox and please wait ${req.query.wait} more minutes for another email`;
			success = false;
		}

		res.render("verifypage", { "selected": "verify", "title": "CloudClub | Verify Email", "message": message, "success": success });
	});
}