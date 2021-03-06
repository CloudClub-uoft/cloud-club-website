module.exports = (app) => {
  app.get('/register', (req, res) => {
    res.render('register');
  });
};
