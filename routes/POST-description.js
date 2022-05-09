module.exports = (app, db, s3Client) => {
    app.post('/description', (req, res) => {
        const sesh = req.session;
        db.query(`UPDATE cloudclub.profiles SET description = '${req.body.description}' WHERE userid='${sesh.userid}'`, (err) => {
            if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); } 
            else return res.status(201).redirect('/profile');
          });
    })
}