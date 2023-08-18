const functions = require("../function.js");

module.exports = (app, db) => {
    app.delete("/deletefunction/:name", function (req, res) {
        functions
            .remove(req.params.name)
            .then((result) => {
                res.redirect("/list-functions");
            })
            .catch((err) => {
                if (process.env.DEBUGLOG) {
                    console.log(err);
                }
                res.redirect("/list-functions");
            });
    });
}
