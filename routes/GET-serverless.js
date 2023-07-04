module.exports = (app, db) => {
    app.get("/functions", (req, res) => {
        res.render("serverless", {
            "title": "CloudClub | Functions", 
            "selected": "functions"}
        );
    });
};