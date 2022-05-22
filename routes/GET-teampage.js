module.exports = (app, db, s3Client) => {
    app.get('/teampage', (req, res) => {
        res.render('teampage', { 'selected': 'teampage', 'title': 'CloudClub | The Team'});
    });
  };
  