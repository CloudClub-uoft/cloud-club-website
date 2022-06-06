/**
 * @api {get} /auth Check Auth State
 * @apiDescription Get the authentication state associated with the current session.
 * @apiName GET-auth
 * @apiGroup Authentication
 *
 * @apiSuccess {String} email User email associated with the current session
 *
 * @apiError (401) - Indicates that there is no authentication state currently active (i.e. the user is not logged in)
 * @apiError (500) {String} error "Internal Server Error 500"
 */
module.exports = (app) => {
	app.get("/auth", (req, res) => {
		try{
			if(req.session.email) {
				return res.status(200).json({ email: req.session.email});
			} else {
				return res.status(401).json();
			}
		} catch {
			return res.status(500).json({error: "Internal Server Error 500"});
		}
	});
};