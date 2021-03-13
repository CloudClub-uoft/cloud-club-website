/**
 * @api {get} /login  User login.
 * @apiName GET-login
 * 
 * @apiParam {*} N/A 
 * 
 * @apiSuccess {String} login
 */


module.exports = (app) => {
  app.get('/login', (req, res) => {
    res.render('login');
  });
};
