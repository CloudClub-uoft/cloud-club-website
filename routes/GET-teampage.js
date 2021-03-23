module.exports = (app, db) => {
    app.get('/members', (req, res) => {
        res.render('teampage', { 'selected': 'teampage', 'title': 'CloudClub | The Team'});
    });
  };
  