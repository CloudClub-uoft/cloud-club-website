const functions = require("../function.js");

module.exports = (app, db) => {
    app.post("/submitfunction", function (req, res) {
        var code = req.body.code;
        var kind = req.body.function;
        functions.create(code, kind).then((result) => {
            if (result === -1) {
                res.send("An error occurred.");
            } else {
                res.render("functionlink", {
                    link_name: result,
                    api_host: process.env.__OW_API_HOST,
                    "title": "CloudClub | Functions",
                    "selected": "function-link"
                });
            }
        });
    });
}
