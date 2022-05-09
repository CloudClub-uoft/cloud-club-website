module.exports = (app, db, s3Client) => {
    app.get('/forum', (req, res) => {
        db.query('SELECT postid, userid, subject, timestamp FROM cloudclub.forum', (err, result) => {
            if (err) {console.log(err);return res.status(500).json({ error: 'Internal Server Error 500' });}
            return res.render('forum', { 'selected': 'forum', 'title': 'CloudClub | Forum', 'data': result, 'tm' : req.query.tm, 'ts' : req.query.ts, 'user_id':req.session.userid});
        });
    });
};