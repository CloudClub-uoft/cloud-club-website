module.exports = (app, db) => {
    app.get('/projects', (req, res) => {
        res.render('projects', { 'selected': 'projects', 'title': 'CloudClub | Projects'});
    });
};
  