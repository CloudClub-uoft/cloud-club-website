/**
 * @api {get} /login  User login.
 * @apiName GET-login
 *
 * @apiSuccess {String} login
 */

module.exports = (app) => {
  app.get('/login', (req, res) => {
    res.render('login');
  });
};
