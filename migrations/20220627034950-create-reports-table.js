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
	db.createTable("reports", {
		"id": {
			type: "bigint",
			notNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		"subject": { type: "string", notNull: true },
		/* eslint-disable */
		"report_verified": { type: "smallint" },
		"subject": { type: "string",  notNull: true },
	}, callback)
	
}

exports.down = function (db, callback) {
	db.dropTable("reports", callback)
}

exports._meta = {
	version: 1,
}
