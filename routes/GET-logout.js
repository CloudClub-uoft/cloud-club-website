// Logout GET request
module.exports = (app) => {
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    });
    return res.redirect('back');
  });
};
