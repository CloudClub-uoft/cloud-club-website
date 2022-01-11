const s3Client = require('../config/s3');
const { v4: uuid } = require('uuid');

module.exports = (app, db) => {
  app.post('/profile', (req, res) => {
    var file;
    var fileExtension;
    var fileKey;
    const sesh = req.session;
    if (!sesh.email) {
        return res.redirect('/?tm=You Aren\'t Logged In!&ts=false');
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.redirect('/profile?tm=No files were uploaded&ts=false');
    }
    file = req.files.image;
    fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
    fileKey = uuid() + "." + fileExtension;
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
      Body: file.data
    };
    s3Client.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      //Update Database
      db.query(`SELECT * FROM cloudclub.profiles WHERE userid='${sesh.userid}'`, (err1, result1) => {
        if (err1) {console.log(err1); return res.status(500).json({ error: 'Internal Server Error 500' });}
        else if (result1.length === 0){
          db.query('INSERT INTO cloudclub.profiles (`profile_path`, `description`, userid) VALUES (?, ?, ?)', [data.Location, '', sesh.userid], (err2) => {
            if (err2) { console.log(err2); return res.status(500).json({ error: 'Internal Server Error 500' }); }
            else return res.status(201).redirect('/profile');
          });
        } 
        else {
          db.query(`UPDATE cloudclub.profiles SET profile_path = '${data.Location}' WHERE userid='${sesh.userid}'`, (err2) => {
            if (err2) { console.log(err2); return res.status(500).json({ error: 'Internal Server Error 500' }); }
            else return res.status(201).redirect('/profile');
          });
        }
      });
    });
  });
};