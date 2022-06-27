"use strict"
const bcrypt = require("bcrypt")
var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate
	type = dbm.dataType
	seed = seedLink
}

exports.up = function (db, callback) {	
	if(!process.env.TEST_ACCOUNT_PASSWORD || !process.env.TEST_ACCOUNT_USERNAME) { 
		console.log("Could not create test account. Ensure that env. vars. exist.")
		return;
	}
	var password = process.env.TEST_ACCOUNT_PASSWORD
	var username = process.env.TEST_ACCOUNT_USERNAME	
	// Hash and store the password
	bcrypt.hash(
		password,
		Number.parseInt(process.env.ENC_ROUNDS),
		(err2, hash) => {
			if (err2) {				
				return
			}
			var query = `INSERT INTO cloudclub.logins (\`first-name\`, \`last-name\`, email, password) VALUES ("Test", "Account", "${username}", "${hash}")`
			console.log(query)
			db.runSql(query, callback)
		}
	)
}

exports.down = function (db, callback) {
	// Delete all data from the logins table
	db.runSql("delete FROM `logins` where 1;", callback)
}

exports._meta = {
	version: 1,
}
