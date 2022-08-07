module.exports = (app) => {
	app.get("/reset", (req, res) => {
		res.render("reset", { "selected": "reset", "title": "CloudClub | Reset Password", r: (req.query["r"] || "/")});
	});
};
