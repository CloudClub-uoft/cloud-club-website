/**
    This is an intermediate view for writing a new post. 
*/

module.exports = (app) => {
	app.get("/newpost", (req, res) => res.render("newpost", { "selected": "forum", "title": "CloudClub | Forum", "email": req.session.email }));
};