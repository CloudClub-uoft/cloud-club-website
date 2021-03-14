/**
 * @api {get} /members Get a list of all of CloudClub’s members.
 * @apiName GET-members
 * @apiGroup ClubMembers
 *
 * @apiSuccess {Object[]} data
 * @apiSuccess {String} data.name Name of Members
 * @apiSuccess {String} data.bio Members Biography
 *
 * @apiError (401) You are not authorized to perform this action.
 * @apiError (500) Internal Server Error 500.
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
