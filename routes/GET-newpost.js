/**
    This is an intermediate view for writing a new post. 
*/

module.exports = (app, db) => {
    app.get('/newpost', (req, res) => {
        const sesh = req.session;
        if (!sesh.email) {
            return res.redirect('/forum?tm=You Aren\'t Logged In!&ts=false')
        }
        return res.render('newpost', { 'selected': 'forum', 'title': 'CloudClub | Forum', 'email': req.session.email });
    });
};