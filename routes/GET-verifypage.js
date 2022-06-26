module.exports = (app) => {
	app.get("/verifypage", (req, res) => {
		res.render("verifypage", { "selected": "verify", "title": "CloudClub | Verify Email" });
	});
}