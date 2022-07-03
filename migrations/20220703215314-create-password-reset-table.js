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
	db.createTable(
		"password_reset",
		{
			request_id: {
				type: "int",
				notNull: true,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: { type: "int", notNull: true },
			request_timestamp: {
				type: "timestamp",
				notNull: true,
				defaultValue: new String("current_timestamp()"),
			},
			token: { type: "string", notNull: true },
		},
		callback
	)
}

exports.down = function (db, callback) {
	db.dropTable("password_reset", callback)
}

exports._meta = {
	version: 1,
}
