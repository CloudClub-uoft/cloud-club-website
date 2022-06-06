module.exports = (app) => {
	app.get("/", (req, res) => {
		res.render("index", { "selected": "/", "title": "CloudClub | Home", "tm" : req.query.tm, "ts" : req.query.ts });
	});
};
