"use strict"

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
	for (var i = 0; i < 5; i++) {
		var subject = `I’m a living furnace number ${i}`
		var body = "He didn’t want to go to the dentist, yet he went anyway."
		var query = `INSERT INTO cloudclub.forum (userid, subject, body) VALUES ("${i}","${subject}","${body}")`		
		db.runSql(query, callback)
	}
}

exports.down = function (db, callback) {
	db.runSql("delete FROM `forum` where 1;", callback)
}

exports._meta = {
	version: 1,
}
