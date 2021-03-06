module.exports = (app) => {
  app.get('/login', (req, res) => {
    res.render('login');
  });
};
