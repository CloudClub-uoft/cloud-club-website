module.exports = (app, db, s3Client) => {
    app.get('/projects', (req, res) => {
        res.render('projects', { 'selected': 'projects', 'title': 'CloudClub | Projects'});
    });
};
  