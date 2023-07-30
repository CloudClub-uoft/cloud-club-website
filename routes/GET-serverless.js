module.exports = (app, db) => {
    app.get("/serverless", (req, res) => {
        res.render("serverless", {
            "title": "CloudClub | Functions", 
            "selected": "serverless"}
        );
    });
};