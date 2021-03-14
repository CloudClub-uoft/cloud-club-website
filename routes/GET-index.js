module.exports = (app, db) => {
  app.get('/', (req, res) => {
    const sesh = req.session;
    if (sesh.email) {
      return res.render('index', { email: sesh.email });
    }
    return res.render('index', { email: false });
  });
};
