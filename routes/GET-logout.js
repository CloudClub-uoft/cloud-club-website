/**
 * @api {get} /logout Log Out
 * @apiDescription Log out from the website, destroying the session.
 * @apiName GET-logout
 * @apiGroup Authentication
 *
 * @apiSuccess (302) {Redirect} Redirect Redirects to previous page (acts as a refresh).
 *
 * @apiError (500) {String} error "Internal Server Error 500"
 */

module.exports = (app, db, s3Client) => {
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    });
    return res.redirect('back');
  });
};
