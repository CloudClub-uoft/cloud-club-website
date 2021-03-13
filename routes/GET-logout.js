/**
 * @api {get} /logout Logout and destroy user session.
 * @apiName GET-logout
 *
 * @apiSuccess [302] redirects to landing page (‘/’)
 *
 * @apiError [500] Internal Server Error 500
 */

module.exports = (app) => {
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error 500' });
    });
    return res.redirect('back');
  });
};
