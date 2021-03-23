module.exports = (app, db) => {
  app.get('/register', (req, res) => {
    res.render('register', { 'selected': 'register', 'title': 'CloudClub | Register', r: (req.query['r'] || '/')});
  });
};
