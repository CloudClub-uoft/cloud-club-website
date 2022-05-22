module.exports = (app, db, s3Client) => {
  app.get('/login', (req, res) => {
    res.render('login', { 'selected': 'login', 'title': 'CloudClub | Login', r: (req.query['r'] || '/')});
  });
};
