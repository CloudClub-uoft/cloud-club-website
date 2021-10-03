/**
 This is an intermediate view for writing a new post.
 */

module.exports = (app, db) => {
    app.get('/editpost', (req, res) => {
        const sesh = req.session;
        if (!sesh.email) {
            return res.redirect('/forum?tm=You Aren\'t Logged In!&ts=false')
        }
        return res.render('editpost', { 'selected': 'forum', 'title': 'CloudClub | Forum', 'email': req.session.email });
    });
};
