"use strict";

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db, callback) {
	// create the comments table
	db.createTable("functions", {
		function_id: {
			type: "int",
			notNull: true,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: "int",
			notNull: true,
			secondaryKey: true
		},
		function_name: {
			type: "string",
			notNull: true
		},
		function_contents: {
			type: "string",
			notNull: true
		},
		language: {
			type: "string",
			notNull: true
		},
		trigger_type: {
			type: "string",
			notNull: true
		},
		/* eslint-disable */
		timestamp: {
			type: "timestamp",
			notNull: true,
			defaultValue: new String("current_timestamp()")
		}
	}, callback);
};

exports.down = function (db, callback) {
	db.dropTable("functions", callback);
};

exports._meta = {
	"version": 1
};
