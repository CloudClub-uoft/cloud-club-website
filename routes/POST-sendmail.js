module.exports = (app, db) => {
	app.post("/sendmail", (req, res) => {
        const email = req.body.email;
		db.query(`SELECT * FROM cloudclub.logins WHERE email=${email}`, (e1, res1) => {
            if (e1) { console.log(e1); return res.status(500).json({ }) }
        })
    })
}