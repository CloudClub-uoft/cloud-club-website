/**
 This is an intermediate view for editing an existing post.
 */

module.exports = (app, db, s3Client) => {
    app.get('/editpost', (req, res) => {
        const sesh = req.session;
        if (!sesh.email) {
            return res.redirect('/forum?tm=You Aren\'t Logged In!&ts=false')
        }

        db.query(`SELECT * FROM cloudclub.forum WHERE postid='${req.query.id}'`, (err2, res2) => {
            if (err2) {
                return res.redirect('/forum?tm=Internal Server Error 500&ts=false');
            }
            return res.render('editpost', { 'selected': 'forum', 'title': 'CloudClub | Forum', 'email': req.session.email, 'post': res2[0] });
        });
    });
};
