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
	db.createTable("logins", {
		"id": {
			type: "int",
			notNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		"first-name": { type: "string", notNull: true },
		"last-name": { type: "string",  notNull: true },
		"email": { type: "string",  notNull: true },
		"password": { type: "string",  notNull: true },
		"date": {type: "timestamp", notNull: true, defaultValue: new String("current_timestamp()")}
	}, callback)
	
}

exports.down = function (db, callback) {
	db.dropTable("logins", callback)
}

exports._meta = {
	version: 1,
}
