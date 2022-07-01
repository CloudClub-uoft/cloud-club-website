module.exports = (app) => {
	app.get("/verifypage", (req, res) => {
		let message = "";
		if (req.query.status === "success") {
			message = "An email has been sent if credentials are valid";
		}

		res.render("verifypage", { "selected": "verify", "title": "CloudClub | Verify Email", "message": message });
	});
}