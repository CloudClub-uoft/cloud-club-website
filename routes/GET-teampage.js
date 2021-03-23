module.exports = (app, db) => {
    app.get('/teampage', (req, res) => {
        res.render('teampage', { 'selected': 'teampage', 'title': 'CloudClub | The Team'});
    });
  };
  