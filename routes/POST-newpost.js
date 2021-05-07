/**
 * @api {post} /newpost New Post
 * @apiDescription Create a new post.
 * @apiName POST-newpost
 * @apiGroup Forum
 * 
 * @apiParam {String} subject Post Title
 * @apiParam {String} body Post Content (Markdown)
 *
 * @apiSuccess (201) {String} message "Post created successfully."
 *
 * @apiError (400) {String} error "Missing fields, check our API docs at cloudclub.ca/api"
 * @apiError (401) {String} error "You are not authorized to perform this action."
 * @apiError (500) {String} error "Internal Server Error 500"
 */

module.exports = (app, db) => {
    // New forum post POST request
    app.post('/newpost', (req, res) => {
        const sesh = req.session;
        if (!sesh.email) {
            return res.status(401).json({ error: 'You are not authorized to perform this action.' });
        }

        const { subject, body, camefrom } = req.body;
        if (subject === undefined || body === undefined) {
            return res.status(400).json({ error: 'Missing fields, check our API docs at cloudclub.ca/api' });
        }

        if (subject === "" || body === "") {
            return res.status(400).json({ error: 'Missing fields, check our API docs at cloudclub.ca/api' });
        }

        db.query(`INSERT INTO cloudclub.forum (userid, subject, body) VALUES (${sesh.userid}, '${subject}', '${body}')`, (err) => {
            if (err) { console.log(err); return res.status(500).json({ error: 'Internal Server Error 500' }); }
            //if the post is created from a webpage, then return the forum page.
            if (camefrom == "webpage") { return res.redirect('/forum') }
            return res.status(201).json({ message: 'Post created successfully.' });
        });
    });
};