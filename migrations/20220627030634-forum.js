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

exports.up = function (db) {
	// Create the forum table
	db.createTable("forum", {
		postid: {
			type: "int",
			notNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		userid: { type: "int", notNull: true },
		subject: { type: "string", defaultValue: "NULL" },
		body: { type: "string", defaultValue: "NULL" },
		timestamp: {type: "timestamp", notNull: true, defaultValue: new String("current_timestamp()")}
	})
}

exports.down = function (db) {
	db.dropTable("forum")
}

exports._meta = {
	version: 1,
}
