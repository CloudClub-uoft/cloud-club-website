const functions = require("../function.js");

module.exports = (app, db) => {
    app.get("/list-functions", (req, res) => {
        const sesh = req.session
        if (!sesh.email) {
            return res.redirect("/?tm=You Aren't Logged In!&ts=false")
        }
        // res.send("You are logged in " + sesh.userid)

        // Query data from MySQL database
        /*
        var query = `SELECT * FROM cloudclub.functions WHERE user_id = '${sesh.userid}'`
        db.query(query, 
            (err1,res1) => {
                if (err1) {
					return res.redirect(
						"/forum?tm=Internal Server Error 500&ts=false"
					)
				}

                //return res.send(`${res1[0].function_name}`)
                res.render("listfunctions", {
                    "title": "CloudClub | List Functions", 
                    "selected": "listfunctions",
                    "result": res1}
                );
            }
        );
        */

        // OpenWhisk
        functions.list().then((res) => {
            res.render("listfunctions", { 
                "result": res,
                "title": "CloudClub | List Functions", 
                "selected": "listfunctions",
            });
        });
    });
};