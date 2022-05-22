module.exports = (app, db, s3Client) => {
  app.get('/register', (req, res) => {
    res.render('register', { 'selected': 'register', 'title': 'CloudClub | Register', r: (req.query['r'] || '/')});
  });
};
