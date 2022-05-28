module.exports = (app, db, s3Client) => {
    app.get('/forum', (req, res) => {
        const LIMIT = (req.query.limit) ? Math.min(req.query.limit, 50) : 10;
        const OFFSET = (req.query.offset) ? Math.max(req.query.offset, 0) : 0;
        q = `
        SELECT count(*) OVER() AS full_count, postid, userid, subject, \`first-name\` as first, \`last-name\` as last, timestamp
        FROM cloudclub.forum f
        JOIN cloudclub.logins l
        ON f.userid = l.id
        `
        if(req.query.sortby === 'newest') {
            q += "ORDER BY timestamp DESC\n"
        } else if (req.query.sortby === 'oldest') {
            q += "ORDER BY timestamp\n"
        } else if (req.query.sortby === 'firstname') {
            q += "ORDER BY first\n"
        } else if (req.query.sortby === 'title') {
            q += "ORDER BY subject\n"
        } else {
            q += "ORDER BY timestamp DESC\n"
        }
        //pagination
        q += `LIMIT ${LIMIT} OFFSET ${OFFSET} `;
        sortby = req.query.sortby ? req.query.sortby : 'newest';
        db.query(q, (err, result) => {

            let firstPage = false;
            let lastPage = false;

            // Check if there are no posts
            if (! result.length ){

                return res.render('forum', { 
                    'selected': 'forum', 
                    'title': 'CloudClub | Forum', 
                    'data': result, 
                    'firstPage':firstPage, 
                    'lastPage':lastPage, 
                    'limit': LIMIT, 
                    'offset': OFFSET, 
                    'sortby': sortby, 
                    'tm': req.query.tm, 
                    'ts': req.query.ts, 
                    'user_id': req.session.userid}
                );
            }

            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    error: 'Internal Server Error 500' 
                });
            }
            
            if (!OFFSET) {
                firstPage = true;
            }
            if (result[0].full_count - OFFSET <= LIMIT) {
                lastPage = true;
            }
            
            return res.render('forum', { 
                'selected': 'forum', 
                'title': 'CloudClub | Forum', 
                'data': result, 
                'firstPage':firstPage, 
                'lastPage':lastPage, 
                'limit': LIMIT, 
                'offset': OFFSET, 
                'sortby': sortby, 
                'tm': req.query.tm, 
                'ts': req.query.ts, 
                'user_id': req.session.userid}
            );
        });
    });
};