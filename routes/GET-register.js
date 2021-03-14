module.exports = (app, db) => {
  app.get('/register', (req, res) => {
    res.render('register');
  });
};
