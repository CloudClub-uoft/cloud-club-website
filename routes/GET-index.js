module.exports = (app, db) => {
  app.get('/', (req, res) => {
    res.render('index', { 'selected': '/', 'title': 'CloudClub | Home' });
  });
};
