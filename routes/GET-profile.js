const defaultImage = `https://cloudclub-iot-blob-dev.s3.ca-central-1.amazonaws.com/5e2bccd5-21e5-4836-bddf-230b2a59f598.jpg`
module.exports = (app, db) => {
  app.get('/profile', (req, res) => {
    const sesh = req.session;
    if (!sesh.email) {
        return res.redirect('/?tm=You Aren\'t Logged In!&ts=false');
    }
    db.query(`SELECT * FROM cloudclub.profiles WHERE userid='${sesh.userid}'`, (err, result1) => {
      if (err) {
          return res.redirect('/?tm=Internal Server Error 500&ts=false');
      }
      else {
        if (result1.length === 0){
          db.query('INSERT INTO cloudclub.profiles (`profile_path`, `description`, userid) VALUES (?, ?, ?)', [defaultImage, '', sesh.userid], (err2) => {
            if (err2) { console.log(err2); return res.redirect('/?tm=Internal Server Error 500&ts=false'); }
            db.query(`SELECT * FROM cloudclub.profiles WHERE userid='${sesh.userid}'`, (err3, result2) => {
              if (err3) { console.log(err2); return res.redirect('/?tm=Internal Server Error 500&ts=false'); }
              return res.render('profile', { 'selected': 'profile', 'title': 'CloudClub | My Profile', 'description': result2[0].description,'profile_path': result2[0].profile_path, 'tm' : req.query.tm, 'ts' : req.query.ts});
            })
          });
        }
        else return res.render('profile', { 'selected': 'profile', 'title': 'CloudClub | My Profile', 'description': result1[0].description,'profile_path': result1[0].profile_path, 'tm' : req.query.tm, 'ts' : req.query.ts}); 
      }
    });
  });
};
