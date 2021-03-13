/**
 * @api {get} / Dynamic Route. 
 * @apiName GET-index
 * 
 * @apiParam {*} N/A
 * 
 * @apiSuccess {string} index
 */

module.exports = (app) => {
  app.get('/', (req, res) => {
    const sesh = req.session;
    if (sesh.email) {
      return res.render('index', { email: sesh.email });
    }
    return res.render('index', { email: false });
  });
};