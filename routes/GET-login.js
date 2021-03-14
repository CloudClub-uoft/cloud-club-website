module.exports = (app, db) => {
  app.get('/login', (req, res) => {
    res.render('login');
  });
};
