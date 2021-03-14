/**
 * @api {get} /members Get list of all of CloudClub’s members
 * @apiName GET-members
 * @apiGroup Club Members
 *
 * @apiSuccess {String} message "All members fetched successfully."
 * @apiSuccess {Object[]} data Member list
 * @apiSuccess {String} data.name Member Name
 * @apiSuccess {String} data.bio Member Bio
 *
 * @apiError (401) {String} error "You are not authorized to perform this action.""
 * @apiError (500) {String} error "Internal Server Error 500"
 */

// Member list GET request
module.exports = (app, db) => {
  app.get('/members', (req, res) => {
    db.query('SELECT * FROM cloudclub.clubmembers', (err, result) => {
      if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
      return res.status(200).json({ message: 'All members fetched successfully.', data: result });
    });
  });
};
