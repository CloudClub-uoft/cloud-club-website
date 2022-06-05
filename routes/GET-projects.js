module.exports = (app) => {
	app.get("/projects", (req, res) => {
		res.render("projects", { "selected": "projects", "title": "CloudClub | Projects"});
	});
};
  