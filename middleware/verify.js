module.exports = (req, res, next) => {
	const sesh = req.session;
	if (!sesh.verified) {
		// get profile is allowed without verification
		if (req.method === "GET" && req.originalUrl === "/profile") {
			next();
		} else {
			return res.status(404).redirect("/verifypage");
		}
	} else {
		next();
	}
};