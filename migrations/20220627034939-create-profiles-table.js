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
	// Create the forum table
	db.createTable("profiles", {
		"profileid": {
			type: "int",
			notNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		"userid": { type: "string", notNull: true },
		"profile_path": { type: "string",  notNull: true },
		"description": { type: "string",  notNull: true },
	}, callback)
	
}

exports.down = function (db, callback) {
	db.dropTable("profiles", callback)
}

exports._meta = {
	version: 1,
}
