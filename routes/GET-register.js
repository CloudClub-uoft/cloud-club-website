module.exports = (app) => {
	app.get("/register", (req, res) => {
		res.render("register", { "selected": "register", "title": "CloudClub | Register", r: (req.query["r"] || "/")});
	});
};
