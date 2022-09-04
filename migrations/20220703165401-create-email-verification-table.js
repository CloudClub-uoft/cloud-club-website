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
	// Create the email_verification table
	db.createTable(
		"email_verification",
		{
			email: { type: "string", notNull: true, autoIncrement: false, primaryKey: true },
			"first-name": { type: "string", notNull: true },
      		"last-name": { type: "string", notNull: true },
			timestamp: {type: "timestamp", notNull: true, defaultValue: new String("current_timestamp()")},
			uuid: {type:"string", notNull: true}
		},
		callback
	)
}

exports.down = function (db, callback) {
	db.dropTable("email_verification", callback)
}

exports._meta = {
	version: 1,
}
